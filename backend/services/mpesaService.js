const axios = require('axios');
require('dotenv').config();

async function getMpesaAccessToken() {
    const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    try {
        const response = await axios.get(
            process.env.MPESA_AUTH_URL || 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('M-PESA auth error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with M-PESA');
    }
}

async function initiateSTKPush(phoneNumber, amount, analysisId) {
    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const requestBody = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.BASE_URL}/api/payment-callback`,
        AccountReference: `ELIMUPATH-${analysisId}`,
        TransactionDesc: 'KCSE Results Analysis Fee'
    };

    try {
        const response = await axios.post(
            process.env.MPESA_STK_URL || 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('STK Push error:', error.response?.data || error.message);
        throw new Error('Failed to initiate payment');
    }
}

module.exports = { initiateSTKPush };
