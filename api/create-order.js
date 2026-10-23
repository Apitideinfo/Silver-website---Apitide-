/* global process */
import { createRazorpayInstance, getRazorpayCredentials } from './utils/razorpay.js';

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
    const { key_id, key_secret } = getRazorpayCredentials();

    if (!key_id || !key_secret) {
      console.error('Razorpay credentials missing from environment (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET)');
      return res.status(500).json({ error: 'Razorpay API credentials not configured on server' });
    }

    const body = await getRequestBody(req);
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = body || {};

    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Amount is required and must be a valid number' });
    }

    const numericAmount = Math.round(Number(amount));

    // Validate amount >= 100 paise (1 Rupee)
    if (numericAmount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise (₹1.00)' });
    }

    const razorpay = createRazorpayInstance();
    if (!razorpay) {
      return res.status(500).json({ error: 'Failed to initialize Razorpay client' });
    }

    const options = {
      amount: numericAmount, // in paise
      currency,
      receipt: String(receipt).slice(0, 40)
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);

    // Handle authentication / permission failures from Razorpay
    const statusCode = error?.statusCode || error?.status;
    if (statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR' && error?.message?.includes('auth')) {
      return res.status(401).json({ error: 'Razorpay authentication failed: invalid API key or secret' });
    }

    const errorMessage = error?.error?.description || error?.message || 'Failed to initialize order with Razorpay';
    return res.status(500).json({ error: errorMessage });
  }
}
