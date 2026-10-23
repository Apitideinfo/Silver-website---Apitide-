/* global process */
import crypto from 'crypto';
import { getRazorpayCredentials } from './utils/razorpay.js';

// Helper to parse request body in any serverless/node environment
async function getRequestBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch (e) {
        return {};
      }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
    });
    req.on('end', () => {
      try {
        resolve(bodyData ? JSON.parse(bodyData) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key_secret } = getRazorpayCredentials();

    if (!key_secret) {
      console.error('RAZORPAY_KEY_SECRET is not configured in environment');
      return res.status(500).json({ error: 'Razorpay secret key not configured on server' });
    }

    const body = await getRequestBody(req);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    // Validate presence of all three fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)'
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Secure timing-safe comparison to prevent timing attacks
    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const actualBuf = Buffer.from(String(razorpay_signature), 'utf-8');
    const isValid = expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);

    if (isValid) {
      return res.status(200).json({
        success: true,
        message: 'Payment signature verified successfully'
      });
    } else {
      console.warn('Razorpay signature mismatch for order:', razorpay_order_id);
      return res.status(400).json({
        success: false,
        error: 'Signature mismatch: payment verification failed'
      });
    }
  } catch (error) {
    console.error('Razorpay Signature Verification Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error verifying payment' });
  }
}
