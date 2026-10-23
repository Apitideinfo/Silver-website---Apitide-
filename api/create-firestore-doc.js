/* global process */
import { admin, serviceAccount } from './utils/firebase-admin-init.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    const { collectionName, docData } = req.body;

    if (!collectionName || !docData) {
      return res.status(400).json({ error: 'Missing collectionName or docData' });
    }

    const db = admin.firestore();
    
    // Parse timestamps securely
    const documentToWrite = {
      ...docData,
      createdDate: docData.createdDate ? new Date(docData.createdDate) : admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection(collectionName).add(documentToWrite);
    
    console.log(`DEBUG: Secure server-side Firestore write succeeded in collection '${collectionName}'. ID:`, docRef.id);

    return res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Serverless Secure Firestore Write Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
