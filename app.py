from datetime import datetime, timedelta, timezone
import base64
from contextlib import contextmanager
import os
import re
import secrets
import sqlite3
from urllib.parse import urlencode

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from requests.auth import HTTPBasicAuth


app = Flask(__name__)
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN")
CORS(app, origins=FRONTEND_ORIGIN or "*")

CONSUMER_KEY = os.environ.get("CONSUMER_KEY")
CONSUMER_SECRET = os.environ.get("CONSUMER_SECRET")
PASSKEY = os.environ.get("PASSKEY")
BUSINESS_SHORT_CODE = os.environ.get("BUSINESS_SHORT_CODE", "174379")
MPESA_ENVIRONMENT = os.environ.get("MPESA_ENVIRONMENT", "sandbox").lower()
MPESA_CALLBACK_URL = os.environ.get(
    "MPESA_CALLBACK_URL",
    "https://comrade-revpat-backend.onrender.com/mpesa-callback",
)
PAYMENT_DB_PATH = os.environ.get(
    "PAYMENT_DB_PATH",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "payments.sqlite3"),
)

DARAJA_URLS = {
    "sandbox": "https://sandbox.safaricom.co.ke",
    "live": "https://api.safaricom.co.ke",
}


@contextmanager
def get_database_connection():
    database_directory = os.path.dirname(PAYMENT_DB_PATH)
    if database_directory:
        os.makedirs(database_directory, exist_ok=True)
    connection = sqlite3.connect(PAYMENT_DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_database():
    with get_database_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS payments (
                checkout_request_id TEXT PRIMARY KEY,
                merchant_request_id TEXT,
                callback_token TEXT,
                phone TEXT NOT NULL,
                amount INTEGER NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        columns = {
            row["name"] for row in connection.execute("PRAGMA table_info(payments)")
        }
        if "callback_token" not in columns:
            connection.execute("ALTER TABLE payments ADD COLUMN callback_token TEXT")
        connection.execute(
            "CREATE UNIQUE INDEX IF NOT EXISTS payments_callback_token_idx "
            "ON payments(callback_token)"
        )


initialize_database()


def get_safaricom_token(base_url):
    response = requests.get(
        f"{base_url}/oauth/v1/generate?grant_type=client_credentials",
        auth=HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET),
        timeout=15,
    )
    response.raise_for_status()
    token_data = response.json()
    if not isinstance(token_data, dict):
        raise ValueError("Daraja returned an invalid token response.")
    token = token_data.get("access_token")
    if not token:
        raise ValueError("Daraja did not return an access token.")
    return token


@app.route("/stkpush", methods=["POST"])
def initiate_stk_push():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"status": "Error", "message": "A JSON request body is required."}), 400

    phone = payload.get("phone")
    amount = payload.get("amount")
    if not isinstance(phone, str) or not re.fullmatch(r"0[17]\d{8}", phone):
        return jsonify({"status": "Error", "message": "Enter a valid Kenyan phone number."}), 400
    if isinstance(amount, bool) or not isinstance(amount, int) or amount not in (50, 100):
        return jsonify({"status": "Error", "message": "The amount must be KSh 50 or KSh 100."}), 400

    if MPESA_ENVIRONMENT not in DARAJA_URLS:
        return jsonify({"status": "Error", "message": "MPESA_ENVIRONMENT must be sandbox or live."}), 500
    if not all((CONSUMER_KEY, CONSUMER_SECRET, PASSKEY)):
        return jsonify({"status": "Error", "message": "Daraja credentials are not configured on the server."}), 503
    if not MPESA_CALLBACK_URL or not MPESA_CALLBACK_URL.startswith("https://"):
        return jsonify({"status": "Error", "message": "Set MPESA_CALLBACK_URL to the public HTTPS callback URL."}), 503

    base_url = DARAJA_URLS[MPESA_ENVIRONMENT]
    formatted_phone = "254" + phone[1:]
    timestamp = datetime.now(timezone(timedelta(hours=3))).strftime("%Y%m%d%H%M%S")
    password_source = BUSINESS_SHORT_CODE + PASSKEY + timestamp
    encoded_password = base64.b64encode(password_source.encode()).decode("utf-8")
    callback_token = secrets.token_urlsafe(32)
    callback_url = MPESA_CALLBACK_URL + ("&" if "?" in MPESA_CALLBACK_URL else "?")
    callback_url += urlencode({"token": callback_token})

    try:
        access_token = get_safaricom_token(base_url)
        response = requests.post(
            f"{base_url}/mpesa/stkpush/v1/processrequest",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            json={
                "BusinessShortCode": BUSINESS_SHORT_CODE,
                "Password": encoded_password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": formatted_phone,
                "PartyB": BUSINESS_SHORT_CODE,
                "PhoneNumber": formatted_phone,
                "CallBackURL": callback_url,
                "AccountReference": "ComradeRevpat",
                "TransactionDesc": "Revision Material Unlock",
            },
            timeout=20,
        )
        response.raise_for_status()
        response_data = response.json()
    except (requests.RequestException, ValueError):
        app.logger.exception("Daraja STK push request failed")
        return jsonify({"status": "Error", "message": "Could not submit the payment request to Daraja."}), 502

    if not isinstance(response_data, dict):
        return jsonify({"status": "Error", "message": "Daraja returned an invalid response."}), 502
    if response_data.get("ResponseCode") != "0":
        return jsonify({
            "status": "Failed",
            "message": response_data.get("ResponseDescription", "Daraja rejected the payment request."),
        }), 400

    checkout_request_id = response_data.get("CheckoutRequestID")
    merchant_request_id = response_data.get("MerchantRequestID")
    if not checkout_request_id or not merchant_request_id:
        app.logger.error("Daraja accepted STK push without returning checkout identifiers")
        return jsonify({"status": "Error", "message": "Daraja did not return a checkout reference."}), 502

    try:
        with get_database_connection() as connection:
            connection.execute(
                """
                INSERT OR REPLACE INTO payments
                    (checkout_request_id, merchant_request_id, callback_token, phone, amount, status, created_at)
                VALUES (?, ?, ?, ?, ?, 'pending', ?)
                """,
                (
                    checkout_request_id,
                    merchant_request_id,
                    callback_token,
                    formatted_phone,
                    amount,
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
    except sqlite3.Error:
        app.logger.exception("Could not save pending payment")
        return jsonify({"status": "Error", "message": "Could not record the checkout. Contact support before retrying."}), 500

    return jsonify({
        "status": "Success",
        "checkout_id": checkout_request_id,
        "message": "STK Push sent. Enter your M-Pesa PIN to complete payment.",
    }), 200


@app.route("/mpesa-callback", methods=["POST"])
def mpesa_callback_listener():
    callback_token = request.args.get("token")
    if not callback_token:
        app.logger.warning("Rejected Daraja callback without its private callback token")
        return jsonify({"ResultCode": 1, "ResultDesc": "Unauthorized callback"}), 403

    callback_data = request.get_json(silent=True)
    try:
        callback = callback_data["Body"]["stkCallback"]
        checkout_request_id = callback["CheckoutRequestID"]
        result_code = callback["ResultCode"]
    except (TypeError, KeyError):
        app.logger.warning("Received malformed Daraja callback")
        return jsonify({"ResultCode": 1, "ResultDesc": "Invalid callback"}), 400

    callback_metadata = callback.get("CallbackMetadata") or {}
    metadata_items = callback_metadata.get("Item", []) if isinstance(callback_metadata, dict) else []
    metadata = {
        item.get("Name"): item.get("Value")
        for item in metadata_items
        if isinstance(item, dict)
    }

    try:
        with get_database_connection() as connection:
            payment = connection.execute(
                "SELECT * FROM payments WHERE checkout_request_id = ? AND callback_token = ?",
                (checkout_request_id, callback_token),
            ).fetchone()

            if payment is None:
                app.logger.warning("Callback received for unknown checkout %s", checkout_request_id)
            elif callback.get("MerchantRequestID") != payment["merchant_request_id"]:
                app.logger.warning("Merchant request ID mismatch for checkout %s", checkout_request_id)
            elif result_code == 0:
                callback_amount = metadata.get("Amount")
                callback_phone = metadata.get("PhoneNumber")
                if callback_amount == payment["amount"] and str(callback_phone) == payment["phone"]:
                    connection.execute(
                        "UPDATE payments SET status = 'paid' WHERE checkout_request_id = ?",
                        (checkout_request_id,),
                    )
                    app.logger.info("Payment confirmed for checkout %s", checkout_request_id)
                else:
                    connection.execute(
                        "UPDATE payments SET status = 'failed' WHERE checkout_request_id = ?",
                        (checkout_request_id,),
                    )
                    app.logger.warning("Callback amount or phone mismatch for checkout %s", checkout_request_id)
            else:
                connection.execute(
                    "UPDATE payments SET status = 'failed' WHERE checkout_request_id = ?",
                    (checkout_request_id,),
                )
                app.logger.info("Payment failed for checkout %s with code %s", checkout_request_id, result_code)
    except sqlite3.Error:
        app.logger.exception("Could not record Daraja callback")
        return jsonify({"ResultCode": 1, "ResultDesc": "Callback processing failed"}), 500

    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200


@app.route("/check-payment/<checkout_id>", methods=["GET"])
def check_payment_status(checkout_id):
    try:
        with get_database_connection() as connection:
            payment = connection.execute(
                "SELECT status FROM payments WHERE checkout_request_id = ?",
                (checkout_id,),
            ).fetchone()
    except sqlite3.Error:
        app.logger.exception("Could not read payment status")
        return jsonify({"status": "Error", "message": "Could not check payment status."}), 500

    if payment is None:
        return jsonify({"status": "NotFound"}), 404
    return jsonify({"status": payment["status"]}), 200


if __name__ == "__main__":
    app.run(port=5000)
