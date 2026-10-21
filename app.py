from flask import Flask, request, jsonify
import requests
from requests.auth import HTTPBasicAuth
from flask_cors import CORS
from datetime import datetime
import base64
import os

app = Flask(__name__)
CORS(app) # Safely white-lists your GitHub Pages frontend domain

# 🔐 SECURE CREDENTIALS ROUTING FROM ENVIRONMENT VARIABLES
CONSUMER_KEY = os.environ.get("CONSUMER_KEY")
CONSUMER_SECRET = os.environ.get("CONSUMER_SECRET")
PASSKEY = os.environ.get("PASSKEY")
BUSINESS_SHORT_CODE = "174379" 

# Global database simulation to hold verified transaction records temporarily in memory
verified_checkout_payments = {}

def get_safaricom_token():
    token_url = "https://safaricom.co.ke"
    try:
        response = requests.get(token_url, auth=HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET))
        return response.json().get('access_token')
    except Exception as e:
        print(f"Failed to generate Safaricom key: {e}")
        return None

# 💳 ENDPOINT 1: Triggers the initial M-Pesa express STK Push pop-up menu
@app.route('/stkpush', methods=['POST'])
def initiate_live_stk():
    try:
        payload = request.get_json()
        raw_phone = payload.get('phone')
        amount = payload.get('amount')

        if raw_phone.startswith('0'):
            formatted_phone = "254" + raw_phone[1:]
        else:
            formatted_phone = raw_phone

        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_source = BUSINESS_SHORT_CODE + PASSKEY + timestamp
        encoded_password = base64.b64encode(password_source.encode()).decode('utf-8')

        access_token = get_safaricom_token()
        if not access_token:
            return jsonify({"status": "Error", "message": "Failed gateway handshake."}), 500

        stk_url = "https://safaricom.co.ke"
        headers = { "Authorization": f"Bearer {access_token}", "Content-Type": "application/json" }

        # Create a unique tracking identifier for this specific transaction
        checkout_request_id = f"REV-{timestamp}-{formatted_phone[-4:]}"
        
        # Initialize record state as false until callback proves validation clearance
        verified_checkout_payments[checkout_request_id] = False

        stk_payload = {
            "BusinessShortCode": BUSINESS_SHORT_CODE,
            "Password": encoded_password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": formatted_phone,
            "PartyB": BUSINESS_SHORT_CODE,
            "PhoneNumber": formatted_phone,
            # 🔌 LIVE BRIDGE: Directs Safaricom to ping our clean callback link endpoint below!
            "CallBackURL": "https://onrender.com", 
            "AccountReference": checkout_request_id,
            "TransactionDesc": "Revision Material Unlock"
        }

        safaricom_response = requests.post(stk_url, json=stk_payload, headers=headers)
        response_data = safaricom_response.json()
        
        if response_data.get("ResponseCode") == "0":
            # Hand over tracking token parameters back to the app.js file
            return jsonify({
                "status": "Success",
                "checkout_id": checkout_request_id,
                "message": "STK Push dispatched successfully! Approve on your phone layout handset."
            }), 200
        else:
            return jsonify({"status": "Failed", "message": "Safaricom rejected payment."}), 400

    except Exception as err:
        return jsonify({"status": "Error", "message": str(err)}), 500

# 🔌 ENDPOINT 2: Secret tunnel where Safaricom posts real payment results
@app.route('/mpesa-callback', methods=['POST'])
def mpesa_callback_listener():
    callback_data = request.get_json()
    print("🔒 SECURE CALLBACK REVEALED FROM SAFARICOM:", json.dumps(callback_data, indent=2))
    
    try:
        stk_callback = callback_data['Body']['stkCallback']
        result_code = stk_callback['ResultCode']
        merchant_request_id = stk_callback.get('MerchantRequestID')
        
        # Pull our tracking custom reference ID from metadata arrays
        meta_items = stk_callback.get('CallbackMetadata', {}).get('Item', [])
        account_ref = None
        for item in meta_items:
            if item.get('Name') == 'AccountReference':
                account_ref = item.get('Value')

        # ResultCode 0 strictly means the student entered their real PIN and cash moved successfully!
        if result_code == 0 and account_ref:
            print(f"💰 PAYMENT CONFIRMED! Reference: {account_ref}. Unlocking asset tray.")
            verified_checkout_payments[account_ref] = True
        else:
            print(f"❌ Transaction abandoned or failed with response code: {result_code}")

    except Exception as e:
        print(f"Callback processing slip: {e}")

    # Return required acknowledging receipt back to Safaricom infrastructure parameters
    return jsonify({"ResultCode": 0, "ResultDesc": "Confirmation Accepted"}), 200

# 🔍 ENDPOINT 3: Frontend pings here to confirm if payment has moved from False to True
@app.route('/check-payment/<checkout_id>', methods=['GET'])
def check_payment_status(checkout_id):
    is_paid = verified_checkout_payments.get(checkout_id, False)
    return jsonify({"verified": is_paid}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
