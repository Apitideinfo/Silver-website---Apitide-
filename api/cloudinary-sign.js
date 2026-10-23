/* global process */
import { cloudinary, cloud_name, api_key, api_secret } from './utils/cloudinary.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'manish_and_co/products';

    const paramsToSign = {
      timestamp,
      folder
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, api_secret);

    return res.status(200).json({
      signature,
      timestamp,
      apiKey: api_key,
      cloudName: cloud_name,
      folder
    });
  } catch (error) {
    console.error('Cloudinary Sign Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
