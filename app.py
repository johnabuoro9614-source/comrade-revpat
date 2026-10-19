from flask import Flask, request, jsonify
import requests
from requests.auth import HTTPBasicAuth
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Connects your GitHub frontend to this backend layout safely

# UPDATED: Private core destination line for business payouts
MY_OFFICIAL_MERCHANT_LINE = "0183324111"

@app.route('/stkpush', methods=['POST'])
def handle_payment_request():
    try:
        incoming_payload = request.get_json()
        student_phone = incoming_payload.get('phone')
        charge_amount = incoming_payload.get('amount')

        print(f"Incoming Secure Transaction request for {student_phone} - Amount: KSh {charge_amount}")

        # Local simulation logging response pointing directly to your new number
        simulation_message = {
            "status": "Success",
            "message": f"Encrypted push triggered for {student_phone}. Processing funds directly to line {MY_OFFICIAL_MERCHANT_LINE}.",
            "amount": charge_amount
        }
        
        return jsonify(simulation_message), 200

    except Exception as error_msg:
        return jsonify({"status": "Error", "message": str(error_msg)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
