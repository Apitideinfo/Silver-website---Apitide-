/* global process */
// Node.js Vercel Serverless Function to securely dispatch transactional email notifications with attached invoice PDF.
// Supports multi-tier providers: Nodemailer (Gmail / Custom SMTP), Resend API, and Brevo API.

import nodemailer from 'nodemailer';
import { generateInvoicePdf } from './utils/generate-invoice-pdf.js';

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

  const { type, recipient, data = {} } = req.body || {};
  const targetEmail = recipient || data.email || data.customerEmail || 'hrjewellerssons@gmail.com';

  let subject;
  let html;
  let pdfBuffer = null;
  let pdfFilename = 'Invoice_HRJ.pdf';

  if (type === 'new_order') {
    const orderId = String(data.orderId || data.id || 'N/A');
    const invoiceNo = data.invoiceNo || data.customInvoiceNo || `HRJ/${new Date().getFullYear()}/${orderId.slice(0, 8).toUpperCase()}`;
    pdfFilename = `Invoice_HRJ_${orderId}.pdf`;

    const dateStr = data.createdDate || data.date
      ? new Date(data.createdDate || data.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    subject = `Order Confirmed — Order #${orderId} | HR Jewellers & Sons`;
    const total = Number(data.total || data.totalAmount || 0);
    const subtotal = Number(data.subtotal || Math.round(total / 1.03));
    const gstAmount = Number(data.gst || Math.round(total - subtotal));
    const discount = Number(data.discount || 0);
    const itemsList = Array.isArray(data.items) ? data.items : [];
    const customerName = data.name || data.recipientName || 'Valued Patron';
    const customerPhone = data.phone || data.mobile || data.recipientMobile || 'N/A';
    const deliveryAddress = data.address || (data.deliveryType === 'store' ? `Showroom Pickup (${data.storeBranch || 'Bikaner Branch'})` : 'Showroom Collection');
    const paymentMethod = String(data.paymentMethod || 'Online / Verified').toUpperCase();
    const paymentStatus = String(data.paymentStatus || 'PAID / CONFIRMED').toUpperCase();

    // 1. Generate Invoice PDF Buffer
    try {
      pdfBuffer = await generateInvoicePdf({
        ...data,
        orderId,
        invoiceNo,
        recipientName: customerName,
        phone: customerPhone,
        email: targetEmail,
        address: deliveryAddress,
        total,
        subtotal,
        gst: gstAmount,
        discount
      });
    } catch (pdfErr) {
      console.error('Invoice PDF generation failed in email handler:', pdfErr);
    }

    // 2. Build Luxury Responsive HTML Email
    html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; border: 1px solid #D4AF37; background-color: #0A0A0A; color: #F5E6C4; border-radius: 16px;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px;">
          <h1 style="color: #D4AF37; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 0.15em; margin: 0;">HR JEWELLERS &amp; SONS</h1>
          <p style="font-size: 10px; color: #E6C687; letter-spacing: 0.3em; margin: 6px 0 0 0; text-transform: uppercase;">Tradition of Trust Since 1996 · Bikaner, Rajasthan</p>
          <p style="font-size: 11px; color: rgba(255,255,255,0.7); margin: 6px 0 0 0;">
            GSTIN: <strong style="color: #D4AF37;">08AASFH1262R1ZM</strong> | State: 08-Rajasthan | Email: hrjewellerssons@gmail.com
          </p>
        </div>

        <!-- Greeting & Confirmation Headline -->
        <div style="margin: 25px 0 15px 0; text-align: left;">
          <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif;">Hello ${customerName},</h2>
          <p style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0;">
            Thank you for shopping with <strong style="color: #D4AF37;">HR Jewellers &amp; Sons</strong>. Your jewellery order has been successfully confirmed and registered in our atelier.
          </p>
        </div>

        <!-- Order Summary Box -->
        <div style="background-color: rgba(212,175,55,0.06); border: 1px solid rgba(212,175,55,0.25); border-radius: 12px; padding: 18px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: rgba(255,255,255,0.9);">
            <tr>
              <td style="padding: 4px 0; color: rgba(255,255,255,0.6); text-transform: uppercase;">ORDER ID:</td>
              <td style="padding: 4px 0; text-align: right; color: #D4AF37; font-weight: bold; font-family: monospace; font-size: 14px;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: rgba(255,255,255,0.6); text-transform: uppercase;">TAX INVOICE NO:</td>
              <td style="padding: 4px 0; text-align: right; color: #E6C687; font-family: monospace;">${invoiceNo}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: rgba(255,255,255,0.6); text-transform: uppercase;">ORDER DATE:</td>
              <td style="padding: 4px 0; text-align: right;">${dateStr}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: rgba(255,255,255,0.6); text-transform: uppercase;">PAYMENT STATUS:</td>
              <td style="padding: 4px 0; text-align: right; color: #10B981; font-weight: bold;">${paymentStatus} (${paymentMethod})</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: rgba(255,255,255,0.6); text-transform: uppercase;">CONTACT MOBILE:</td>
              <td style="padding: 4px 0; text-align: right;">${customerPhone}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: rgba(255,255,255,0.6); text-transform: uppercase;">DELIVERY ADDRESS:</td>
              <td style="padding: 4px 0; text-align: right; max-width: 280px; word-break: break-word;">${deliveryAddress}</td>
            </tr>
          </table>
        </div>

        <!-- 1-Click Track Button -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://hrjewellers.in/?track=${orderId}" style="background: linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%); color: #000000; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 10px; display: inline-block; letter-spacing: 0.15em; text-transform: uppercase; box-shadow: 0 4px 15px rgba(212,175,55,0.3);">
            🚚 Track Live Order Status
          </a>
        </div>

        <!-- Items Table -->
        <h3 style="color: #D4AF37; font-family: 'Playfair Display', Georgia, serif; font-size: 15px; margin: 25px 0 10px 0; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 8px;">
          Purchased Jewellery Items
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: rgba(255,255,255,0.9);">
          <thead>
            <tr style="border-bottom: 1px solid #D4AF37; text-align: left; color: #E6C687; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 8px 4px;">Item Description</th>
              <th style="padding: 8px 4px; text-align: center;">Purity / Spec</th>
              <th style="padding: 8px 4px; text-align: center;">Qty</th>
              <th style="padding: 8px 4px; text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList.map(item => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px 4px; font-weight: 600;">
                  ${item.name}
                  ${item.desc ? `<div style="font-size: 10px; color: rgba(255,255,255,0.5); font-weight: normal;">${item.desc}</div>` : ''}
                </td>
                <td style="padding: 10px 4px; text-align: center; color: rgba(255,255,255,0.6); font-size: 11px;">
                  ${item.carat || item.weight ? `${item.carat || ''} ${item.weight ? `(${item.weight}g)` : ''}` : 'BIS 916 Hallmarked'}
                </td>
                <td style="padding: 10px 4px; text-align: center;">${item.quantity || 1}</td>
                <td style="padding: 10px 4px; text-align: right; color: #D4AF37; font-weight: bold;">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Tax & Total Calculation -->
        <div style="margin-top: 20px; border-top: 1px solid rgba(212,175,55,0.25); padding-top: 15px; font-size: 13px; line-height: 1.8;">
          <div style="display: flex; justify-content: space-between; color: rgba(255,255,255,0.7);">
            <span>Taxable Subtotal:</span>
            <span>₹${Number(subtotal).toLocaleString('en-IN')}</span>
          </div>
          ${discount > 0 ? `
            <div style="display: flex; justify-content: space-between; color: #10B981;">
              <span>Special Scheme Discount:</span>
              <span>- ₹${Number(discount).toLocaleString('en-IN')}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; color: rgba(255,255,255,0.7);">
            <span>GST (3% Jewellery Tax):</span>
            <span>₹${Number(gstAmount).toLocaleString('en-IN')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #10B981;">
            <span>Fully Insured Shipping:</span>
            <span>FREE (₹0)</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #D4AF37; font-size: 17px; font-weight: bold; margin-top: 8px; border-top: 2px solid #D4AF37; padding-top: 8px;">
            <span>Grand Total:</span>
            <span>₹${Number(total).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <!-- Attachment Notice Box -->
        <div style="background-color: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px; margin: 25px 0 15px 0; text-align: center; font-size: 12px; color: #A7F3D0;">
          📄 <strong>Official Tax Invoice Attached:</strong> Your GST tax invoice (<code>${pdfFilename}</code>) is attached to this email for your accounting and insurance records.
        </div>

        <!-- Footer Notice -->
        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.25); margin: 25px 0 15px 0;" />
        <p style="font-size: 11px; color: rgba(255,255,255,0.5); text-align: center; line-height: 1.6; margin: 0;">
          All jewellery certified by Bureau of Indian Standards (BIS Hallmarked with unique laser HUID).<br/>
          For customer concierge or modifications, call/WhatsApp: <strong style="color: #D4AF37;">+91 97838 43978</strong>
        </p>
      </div>
    `;
  } else if (type === 'consultation') {
    subject = `New Boutique Fitting Lounge Booking - HR Jewellers & Sons`;
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #D4AF37; background-color: #0B0605; color: #F5E6C4;">
        <h2 style="color: #D4AF37; font-family: serif; font-weight: normal; letter-spacing: 0.15em; text-align: center;">HR JEWELLERS & SONS</h2>
        <p style="text-align: center; font-size: 10px; color: #D4AF37; letter-spacing: 0.25em;">OM SHANTI · BIKANERI TRADITIONAL ARTISTRY</p>
        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.35); margin: 20px 0;" />
        <h3 style="color: #fff; font-family: serif; font-weight: normal;">Bespoke Lounge Appointment Reserved</h3>
        <p style="font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6;">We are delighted to confirm your private showroom consultation request:</p>
        
        <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,85,0.15); padding: 15px; border-radius: 12px; margin: 15px 0; font-size: 12px; line-height: 1.8;">
          <p style="margin: 3px 0;"><strong>Patron Name:</strong> ${data.name}</p>
          <p style="margin: 3px 0;"><strong>Phone Number:</strong> ${data.phone}</p>
          <p style="margin: 3px 0;"><strong>Email Address:</strong> ${data.email || 'N/A'}</p>
          <p style="margin: 3px 0;"><strong>Preferred Date:</strong> ${data.date}</p>
          <p style="margin: 3px 0;"><strong>Preferred Time Slot:</strong> ${data.time}</p>
          <p style="margin: 3px 0;"><strong>Inquiry Specialty:</strong> <span style="color: #D4AF37; font-weight: bold;">${data.requestType}</span></p>
          ${data.notes ? `<p style="margin: 3px 0;"><strong>Patron Notes:</strong> ${data.notes}</p>` : ''}
        </div>

        <p style="font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.6; text-align: center; margin-top: 20px;">
          Please present this confirmation when you arrive at Tilak Nagar showroom workshop.
        </p>

        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.25); margin: 30px 0 15px 0;" />
        <p style="font-size: 10px; color: rgba(255,255,255,0.4); text-align: center; letter-spacing: 0.1em; line-height: 1.5;">
          Om Shanti · HR Jewellers & Sons, Tilak Nagar, Bikaner (Raj.) · Since 1996
        </p>
      </div>
    `;
  } else if (type === 'gold_saving_scheme') {
    subject = `New 11+1 Gold Saving Scheme Application - HR Jewellers & Sons`;
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #D4AF37; background-color: #0B0605; color: #F5E6C4;">
        <h2 style="color: #D4AF37; font-family: serif; font-weight: normal; letter-spacing: 0.15em; text-align: center;">HR JEWELLERS & SONS</h2>
        <p style="text-align: center; font-size: 10px; color: #D4AF37; letter-spacing: 0.25em;">11+1 GOLD SAVING PLAN REGISTRATION</p>
        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.35); margin: 20px 0;" />
        <h3 style="color: #fff; font-family: serif; font-weight: normal;">New GRP Enrollment Application</h3>
        <p style="font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6;">We have received a new premium scheme application. Details are below:</p>
        
        <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,85,0.15); padding: 15px; border-radius: 12px; margin: 15px 0; font-size: 12px; line-height: 1.8;">
          <p style="margin: 3px 0;"><strong>Patron Name:</strong> ${data.name}</p>
          <p style="margin: 3px 0;"><strong>Mobile Number:</strong> ${data.phone}</p>
          <p style="margin: 3px 0;"><strong>Email Address:</strong> ${data.email || 'N/A'}</p>
          <p style="margin: 3px 0;"><strong>City:</strong> ${data.city || 'N/A'}</p>
          <p style="margin: 3px 0;"><strong>Aadhaar Number:</strong> ${data.aadhaar || 'N/A'}</p>
          <p style="margin: 3px 0;"><strong>Monthly Amount:</strong> <span style="color: #D4AF37; font-weight: bold;">₹${data.amount?.toLocaleString('en-IN') || '0'}</span></p>
          <p style="margin: 3px 0;"><strong>11 Months Paid:</strong> ₹${(data.amount * 11)?.toLocaleString('en-IN') || '0'}</p>
          <p style="margin: 3px 0;"><strong>GRP Bonus (Month 12):</strong> ₹${data.amount?.toLocaleString('en-IN') || '0'}</p>
          <p style="margin: 3px 0;"><strong>Total Mature Value:</strong> <span style="color: #4cd137; font-weight: bold;">₹${(data.amount * 12)?.toLocaleString('en-IN') || '0'}</span></p>
          <p style="margin: 3px 0;"><strong>Preferred Showroom Branch:</strong> ${data.branch || 'Tilak Nagar'}</p>
        </div>

        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.25); margin: 30px 0 15px 0;" />
        <p style="font-size: 10px; color: rgba(255,255,255,0.4); text-align: center; letter-spacing: 0.1em; line-height: 1.5;">
          Om Shanti · HR Jewellers & Sons, Tilak Nagar, Bikaner (Raj.) · Since 1996
        </p>
      </div>
    `;
  } else if (type === 'custom_design_request') {
    subject = `New Custom Ornaments Design Request - HR Jewellers & Sons`;
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #D4AF37; background-color: #0B0605; color: #F5E6C4;">
        <h2 style="color: #D4AF37; font-family: serif; font-weight: normal; letter-spacing: 0.15em; text-align: center;">HR JEWELLERS & SONS</h2>
        <p style="text-align: center; font-size: 10px; color: #D4AF37; letter-spacing: 0.25em;">BESPOKE ATELIER CONCIERGE</p>
        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.35); margin: 20px 0;" />
        <h3 style="color: #fff; font-family: serif; font-weight: normal;">Bespoke Handcrafted Design Lead</h3>
        <p style="font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6;">A patron has submitted a new custom jewelry design request. Specifications are logged below:</p>
        
        <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,85,0.15); padding: 15px; border-radius: 12px; margin: 15px 0; font-size: 12px; line-height: 1.8;">
          <p style="margin: 3px 0;"><strong>Patron Name:</strong> ${data.name}</p>
          <p style="margin: 3px 0;"><strong>Mobile Number:</strong> ${data.phone}</p>
          <p style="margin: 3px 0;"><strong>Email Address:</strong> ${data.email || 'N/A'}</p>
          <p style="margin: 3px 0;"><strong>City:</strong> ${data.city || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.05); margin: 10px 0;" />
          <p style="margin: 3px 0;"><strong>Jewelry Type Requested:</strong> ${data.jewelryType || 'N/A'}</p>
          <p style="margin: 3px 0;"><strong>Material Preference:</strong> ${data.material || 'N/A'}</p>
          <p style="margin: 3px 0;"><strong>Budget Framework:</strong> <span style="color: #D4AF37; font-weight: bold;">${data.budget || 'N/A'}</span></p>
          <p style="margin: 3px 0;"><strong>Custom Requirements:</strong> ${data.description || 'No description provided'}</p>
          ${data.fileName ? `<p style="margin: 3px 0;"><strong>Uploaded Document/Sketch:</strong> ${data.fileName}</p>` : ''}
        </div>

        ${data.fileData ? `
          <div style="margin: 20px 0; text-align: center;">
            <p style="font-size: 11px; color: #D4AF37; margin-bottom: 8px;">Uploaded Sketch Reference Preview:</p>
            <img src="${data.fileData}" style="max-width: 100%; border: 1px solid #D4AF37; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);" alt="Custom design sketch" />
          </div>
        ` : ''}

        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.25); margin: 30px 0 15px 0;" />
        <p style="font-size: 10px; color: rgba(255,255,255,0.4); text-align: center; letter-spacing: 0.1em; line-height: 1.5;">
          Om Shanti · HR Jewellers & Sons, Tilak Nagar, Bikaner (Raj.) · Since 1996
        </p>
      </div>
    `;
  } else if (type === 'password_reset') {
    subject = `Reset Your Vault Password - HR Jewellers & Sons`;
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #D4AF37; background-color: #0B0605; color: #F5E6C4; border-radius: 16px;">
        <h2 style="color: #D4AF37; font-family: serif; font-weight: normal; letter-spacing: 0.15em; text-align: center; margin: 0 0 5px 0;">HR JEWELLERS & SONS</h2>
        <p style="text-align: center; font-size: 10px; color: #D4AF37; letter-spacing: 0.25em; margin: 0;">ESTABLISHED 1952 · BIKANER</p>
        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.35); margin: 20px 0;" />
        <h3 style="color: #fff; font-family: serif; font-weight: normal; font-size: 18px; margin-bottom: 10px;">Administrator Vault Password Reset</h3>
        <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.6;">
          A password reset request was initiated for your administrator account: <strong style="color: #D4AF37;">${data.email || targetEmail}</strong>.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" style="background: linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%); color: #000; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block; letter-spacing: 0.05em;">
            Reset Password Now
          </a>
        </div>
        <p style="font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.6;">
          Or copy and paste this link in your browser:<br/>
          <span style="color: #D4AF37; word-break: break-all;">${data.resetLink}</span>
        </p>
        <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,85,0.15); padding: 12px; border-radius: 8px; margin: 20px 0; font-size: 11px; color: rgba(255,255,255,0.6);">
          ⚠️ <strong>Security Notice:</strong> This reset link is valid for 1 hour. If you did not request this change, please ignore this email or notify your system administrator.
        </div>
        <hr style="border: 0; border-top: 1px solid rgba(212, 175, 85, 0.25); margin: 25px 0 15px 0;" />
        <p style="font-size: 10px; color: rgba(255,255,255,0.4); text-align: center; letter-spacing: 0.1em;">
          HR Jewellers & Sons · Station Road, Kote Gate, Bikaner, Rajasthan 344001
        </p>
      </div>
    `;
  } else {
    subject = `New Transactional Notification - HR Jewellers & Sons`;
    html = `<h3>New Activity Recorded</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
  }

  // =========================================================================
  // MULTI-PROVIDER DISPATCH ENGINE
  // =========================================================================

  // Provider 1: SMTP / Gmail (via Nodemailer)
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || process.env.EMAIL_PASS;
  const smtpFrom = process.env.SMTP_FROM || `HR Jewellers & Sons <${smtpUser || 'hrjewellerssons@gmail.com'}>`;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport(
        smtpHost
          ? {
              host: smtpHost,
              port: smtpPort,
              secure: smtpPort === 465,
              auth: { user: smtpUser, pass: smtpPass }
            }
          : {
              service: 'gmail',
              auth: { user: smtpUser, pass: smtpPass }
            }
      );

      const mailOptions = {
        from: smtpFrom,
        to: targetEmail,
        subject: subject,
        html: html,
        attachments: pdfBuffer ? [{ filename: pdfFilename, content: pdfBuffer }] : []
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via Nodemailer SMTP:', info.messageId);
      return res.status(200).json({
        success: true,
        provider: 'smtp',
        messageId: info.messageId,
        recipient: targetEmail
      });
    } catch (smtpErr) {
      console.error('Nodemailer SMTP dispatch failed, trying fallbacks:', smtpErr);
    }
  }

  // Provider 2: Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromEmail = process.env.RESEND_FROM || 'HR Jewellers <onboarding@resend.dev>';
      const payload = {
        from: fromEmail,
        to: [targetEmail],
        subject: subject,
        html: html,
        attachments: pdfBuffer
          ? [{ filename: pdfFilename, content: pdfBuffer.toString('base64') }]
          : []
      };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      if (response.ok) {
        return res.status(200).json({ success: true, provider: 'resend', data: resData, recipient: targetEmail });
      }
      console.warn('Resend API returned non-OK status:', resData);
    } catch (resendErr) {
      console.error('Resend API dispatch error:', resendErr);
    }
  }

  // Provider 3: Brevo (Sendinblue) API
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const payload = {
        sender: { name: 'HR Jewellers & Sons', email: 'hrjewellerssons@gmail.com' },
        to: [{ email: targetEmail }],
        subject: subject,
        htmlContent: html,
        attachment: pdfBuffer
          ? [{ name: pdfFilename, content: pdfBuffer.toString('base64') }]
          : []
      };

      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const brevoData = await brevoRes.json();
      if (brevoRes.ok) {
        return res.status(200).json({ success: true, provider: 'brevo', data: brevoData, recipient: targetEmail });
      }
      console.warn('Brevo API returned error:', brevoData);
    } catch (brevoErr) {
      console.error('Brevo dispatch error:', brevoErr);
    }
  }

  // Fallback: If no provider keys configured on Vercel
  console.warn(
    'No live email credentials (GMAIL_USER + GMAIL_APP_PASSWORD, RESEND_API_KEY, or BREVO_API_KEY) found in environment variables.'
  );

  return res.status(200).json({
    success: true,
    mock: true,
    recipient: targetEmail,
    subject,
    hasPdfAttachment: Boolean(pdfBuffer),
    notice: 'To receive emails in real customer inboxes, configure GMAIL_USER + GMAIL_APP_PASSWORD or RESEND_API_KEY in Vercel Environment Variables.'
  });
}

