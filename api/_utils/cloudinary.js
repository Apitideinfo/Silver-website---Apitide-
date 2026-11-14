/* global process */
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEnvValue(key) {
  if (process.env[key]) return process.env[key];

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

const cloud_name = getEnvValue('CLOUDINARY_CLOUD_NAME') || getEnvValue('VITE_CLOUDINARY_CLOUD_NAME') || 'pndcvmmv';
const api_key = getEnvValue('CLOUDINARY_API_KEY') || getEnvValue('VITE_CLOUDINARY_API_KEY') || '964738754459215';
const api_secret = getEnvValue('CLOUDINARY_API_SECRET') || 'k7ez21qlBxxriyGY4f8h4QFQytk';

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true
});

export { cloudinary, cloud_name, api_key, api_secret };
export default cloudinary;
