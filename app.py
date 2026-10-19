from flask import Flask, request, jsonify
import requests
from requests.auth import HTTPBasicAuth
from flask_cors import CORS
from datetime import datetime
import base64

app = Flask(__name__)
CORS(app) # Connects your GitHub frontend to this backend layout safely

# 🔐 YOUR AUTHENTIC DARAJA GATEWAY CREDENTIALS
CONSUMER_KEY = "lAMjUC7gJAkyIvUqONIubG992NT9OODbx1bfpA1ubGCYdFEK"
CONSUMER_SECRET = "ncMQ7WqlXa84fOMQlbuibBFSFab9GROvvtLMCOddJW4NOitSVdl1P8ZrABlR4LP4"
PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"

BUSINESS_SHORT_CODE = "174379" # Standard Safaricom Express Test Shortcode

# 🔑 Token Builder: Requests a live 60-minute session token from Safaricom
def get_safaricom_token():
    token_url = "https://safaricom.co.ke"
    try:
        response = requests.get(token_url, auth=HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET))
        token_data = response.json()
        print("🔑 Safaricom Token Generated Successfully!")
        return token_data.get('access_token')
    except Exception as e:
        print(f"❌ Token generation breakdown: {e}")
        return None

@app.route('/stkpush', methods=['POST'])
def initiate_live_stk():
    try:
        payload = request.get_json()
        raw_phone = payload.get('phone') # Pulls user number from app.js
        amount = payload.get('amount')

        # 🔄 Format conversion: Convert '07...' or '01...' into Safaricom's required '254...' format
        if raw_phone.startswith('0'):
            formatted_phone = "254" + raw_phone[1:]
        else:
            formatted_phone = raw_phone

        # Create a dynamic Timestamp matching Daraja specifications (YYYYMMDDHHMMSS)
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        
        # 🛡️ Generate the cryptographic Password Hash
        password_source = BUSINESS_SHORT_CODE + PASSKEY + timestamp
        encoded_password = base64.b64encode(password_source.encode()).decode('utf-8')

        access_token = get_safaricom_token()
        if not access_token:
            return jsonify({"status": "Error", "message": "Failed to authenticate session with Safaricom server."}), 500

        stk_url = "https://safaricom.co.ke"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        # Official Safaricom M-Pesa Express JSON payload structure
        stk_payload = {
            "BusinessShortCode": BUSINESS_SHORT_CODE,
            "Password": encoded_password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": formatted_phone,
            "PartyB": BUSINESS_SHORT_CODE,
            "PhoneNumber": formatted_phone,
            "CallBackURL": "https://vercel.app", # Standard listener path holder
            "AccountReference": "ComradeRevpat",
            "TransactionDesc": "Premium Revision Materials Unlock"
        }

        print(f"🚀 Firing Live STK Push payload request for: {formatted_phone}")
        safaricom_response = requests.post(stk_url, json=stk_payload, headers=headers)
        response_data = safaricom_response.json()
        
        print("📦 Safaricom Server Response:", response_data)
        
        # Parse output codes from Safaricom gateway infrastructure
        if response_data.get("ResponseCode") == "0":
            return jsonify({
                "status": "Success",
                "message": f"STK Push prompt dispatched successfully to {raw_phone}! Check your handset screen to authorize."
            }), 200
        else:
            return jsonify({
                "status": "Failed",
                "message": response_data.get("ResponseDescription", "Safaricom rejected the checkout parameters.")
            }), 400

    except Exception as err:
        print(f"❌ Server Runtime crash: {err}")
        return jsonify({"status": "Error", "message": str(err)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

