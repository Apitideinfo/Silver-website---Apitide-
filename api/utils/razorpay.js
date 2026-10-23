/* global process */
import Razorpay from 'razorpay';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to ensure env variables are loaded even in standalone Node invocation
function getEnvValue(key) {
  if (process.env[key]) return process.env[key];

  // Attempt reading from .env.local or .env in project root
  const envFiles = [
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../.env')
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      try {
        const content = fs.readFileSync(envFile, 'utf8');
        const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
        if (match && match[1]) {
          const val = match[1].trim().replace(/^["']|["']$/g, '');
          process.env[key] = val;
          return val;
        }
      } catch (e) {
        // ignore
      }
    }
  }

  return null;
}

export function getRazorpayCredentials() {
  const key_id = getEnvValue('RAZORPAY_KEY_ID');
  const key_secret = getEnvValue('RAZORPAY_KEY_SECRET');

  return { key_id, key_secret };
}

export function createRazorpayInstance() {
  const { key_id, key_secret } = getRazorpayCredentials();

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret
  });
}
