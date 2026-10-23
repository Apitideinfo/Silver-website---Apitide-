/* global process, Buffer */
import { cloudinary, cloud_name } from './utils/cloudinary.js';
import { admin, serviceAccount } from './utils/firebase-admin-init.js';
import crypto from 'crypto';

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

  // GET Diagnostics Endpoint
  if (req.method === 'GET') {
    try {
      let cloudinaryStatus = 'Checking...';
      try {
        const ping = await cloudinary.api.ping();
        cloudinaryStatus = ping.status === 'ok' ? 'Connected' : 'Error';
      } catch (cErr) {
        cloudinaryStatus = 'Disconnected: ' + cErr.message;
      }

      return res.status(200).json({
        success: true,
        cloudinary: {
          cloudName: cloud_name,
          status: cloudinaryStatus
        },
        firebase: {
          projectId: serviceAccount?.project_id || 'Not configured'
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileData, folder = 'manish_and_co/products' } = req.body || {};

    if (!fileData) {
      return res.status(400).json({ error: 'Missing fileData (base64 string or URL required)' });
    }

    // 1. Primary: Upload directly to Cloudinary
    try {
      console.log(`DEBUG: Uploading ${fileName || 'media'} to Cloudinary (folder: ${folder})...`);
      const uploadRes = await cloudinary.uploader.upload(fileData, {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false
      });

      console.log(`DEBUG: Cloudinary upload succeeded! URL:`, uploadRes.secure_url);

      return res.status(200).json({
        success: true,
        downloadURL: uploadRes.secure_url,
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        resourceType: uploadRes.resource_type,
        format: uploadRes.format,
        width: uploadRes.width,
        height: uploadRes.height
      });
    } catch (cloudinaryErr) {
      console.warn('Cloudinary upload encountered an error, evaluating fallback:', cloudinaryErr.message);

      // If Firebase Admin is available, fallback to Firebase Storage
      if (admin && admin.apps?.length) {
        const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          let bucket;
          let bucketName;
          try {
            const [buckets] = await admin.storage().getBuckets();
            if (buckets && buckets.length > 0) {
              bucket = buckets[0];
              bucketName = bucket.name;
            }
          } catch (e) {
            bucketName = `${serviceAccount.project_id}.appspot.com`;
            bucket = admin.storage().bucket(bucketName);
          }

          if (bucket) {
            const name = `custom-designs/${Date.now()}_${fileName || 'media.jpg'}`;
            const file = bucket.file(name);
            const downloadToken = crypto.randomUUID();

            await file.save(buffer, {
              metadata: {
                contentType,
                metadata: { firebaseStorageDownloadTokens: downloadToken }
              }
            });

            const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(name)}?alt=media&token=${downloadToken}`;
            return res.status(200).json({ success: true, downloadURL: downloadUrl, url: downloadUrl });
          }
        }
      }

      throw cloudinaryErr;
    }
  } catch (error) {
    console.error('Serverless Upload Error:', error);
    return res.status(500).json({ error: error.message || 'Image upload failed' });
  }
}
