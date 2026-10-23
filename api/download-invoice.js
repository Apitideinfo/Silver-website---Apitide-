import { generateInvoicePdf } from './utils/generate-invoice-pdf.js';

async function getRequestBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch (e) { return {}; }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', () => {
      try { resolve(bodyData ? JSON.parse(bodyData) : {}); } catch (e) { resolve({}); }
    });
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let orderData = {};
    if (req.method === 'POST') {
      orderData = await getRequestBody(req);
    } else if (req.method === 'GET') {
      const urlObj = new URL(req.url, 'http://localhost');
      const rawData = urlObj.searchParams.get('data');
      if (rawData) {
        try { orderData = JSON.parse(decodeURIComponent(rawData)); } catch (e) {}
      }
    }

    const orderId = orderData.orderId || orderData.id || 'Order';
    const pdfBuffer = await generateInvoicePdf(orderData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Invoice_HRJ_${orderId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.status(200).end(pdfBuffer);
  } catch (error) {
    console.error('Invoice generation endpoint error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate invoice PDF' });
  }
}
