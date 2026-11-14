/* global process */
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount = null;

// 1. Try local serviceAccountKey.json in api folder
const localKeyPath = path.resolve(__dirname, '../serviceAccountKey.json');
if (fs.existsSync(localKeyPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
  } catch (e) {
    console.warn('Failed to parse api/serviceAccountKey.json:', e.message);
  }
}

// 2. Try process.env.FIREBASE_SERVICE_ACCOUNT
if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', e.message);
  }
}

// Initialize Admin App if not already initialized
if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: serviceAccount.project_id + '.firebasestorage.app'
  });
}

export { admin, serviceAccount };
export default admin;
