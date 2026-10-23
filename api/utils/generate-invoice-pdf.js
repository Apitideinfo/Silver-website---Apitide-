/* global Buffer */
import PDFDocument from 'pdfkit';

/**
 * Generates an official Tax Invoice PDF for an order using pdfkit.
 * Returns a Promise that resolves with a Buffer containing the complete PDF binary.
 *
 * @param {Object} order - Order object containing details, items, pricing, customer info.
 * @returns {Promise<Buffer>}
 */
export async function generateInvoicePdf(order = {}) {
  return new Promise((resolve, reject) => {
    try {
      const orderId = String(order.orderId || order.id || 'N/A');
      const invoiceNo = order.invoiceNo || order.customInvoiceNo || ('HRJ/' + new Date().getFullYear() + '/' + orderId.slice(0, 8).toUpperCase());

      const doc = new PDFDocument({
        size: 'A4',
        margin: 36,
        info: {
          Title: 'Tax Invoice - ' + invoiceNo,
          Author: 'HR Jewellers & Sons',
          Subject: 'Official Jewellery Tax Invoice',
          Keywords: 'Jewellery, Invoice, Gold, Diamonds, BIS Hallmark',
          CreationDate: new Date()
        }
      });

      const buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', err => reject(err));

      const dateStr = order.createdDate || order.date
        ? new Date(order.createdDate || order.date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      const customerName = order.name || order.recipientName || 'Valued Customer';
      const customerPhone = order.phone || order.mobile || order.recipientMobile || 'N/A';
      const customerEmail = order.email || order.customerEmail || 'N/A';
      const paymentMethod = String(order.paymentMethod || 'Online / Razorpay').toUpperCase();
      const paymentStatus = String(order.paymentStatus || 'PAID').toUpperCase();
      const paymentId = order.paymentId || order.razorpayPaymentId || 'N/A';

      const deliveryAddress = order.address || (order.deliveryType === 'store' ? ('Showroom Pickup (' + (order.storeBranch || 'Bikaner Branch') + ')') : 'Showroom Collection');

      const total = Number(order.total || order.totalAmount || 0);
      const subtotal = Number(order.subtotal || Math.round(total / 1.03));
      const gst = Number(order.gst || Math.round(total - subtotal));
      const cgst = Math.round(gst / 2);
      const sgst = gst - cgst;
      const discount = Number(order.discount || 0);

      const items = Array.isArray(order.items) ? order.items : [];

      // Top Gold Accent Bar
      doc.rect(0, 0, doc.page.width, 6).fill('#B8893C');

      // Brand Header & Company Information
      doc.fillColor('#1A1A1A').fontSize(18).font('Helvetica-Bold').text('HR JEWELLERS & SONS', 36, 24);
      doc.fillColor('#B8893C').fontSize(8).font('Helvetica-Bold').text('TRADITION OF TRUST SINCE 1996 · BIS HALLMARKED LUXURY BOUTIQUE', 36, 45);
      doc.fillColor('#555555').fontSize(8).font('Helvetica')
         .text('4-D-37, Near Murti Circle, J.N.V. Colony, Bikaner, Rajasthan (334001)', 36, 58)
         .text('Contact: +91 97838 43978 | Email: hrjewellerssons@gmail.com | Web: www.hrjewellers.in', 36, 70)
         .font('Helvetica-Bold').fillColor('#222222')
         .text('GSTIN: 08AASFH1262R1ZM | State Code: 08-Rajasthan', 36, 82);

      // Invoice Metadata Right Box
      doc.fillColor('#B8893C').fontSize(16).font('Helvetica-Bold').text('TAX INVOICE', 380, 24, { width: 179, align: 'right' });
      doc.fillColor('#444444').fontSize(8.5).font('Helvetica')
         .text('Invoice No: ' + invoiceNo, 380, 46, { width: 179, align: 'right' })
         .text('Order ID: #' + orderId, 380, 58, { width: 179, align: 'right' })
         .text('Date: ' + dateStr, 380, 70, { width: 179, align: 'right' })
         .text('Payment: ' + paymentMethod, 380, 82, { width: 179, align: 'right' });

      if (paymentId && paymentId !== 'N/A') {
        doc.text('Ref/Txn: ' + paymentId, 380, 94, { width: 179, align: 'right' });
      }

      // Separator Line
      doc.strokeColor('#E2D8C3').lineWidth(1).moveTo(36, 110).lineTo(559, 110).stroke();

      // Billed To & Shipping Destination Boxes
      const boxY = 118;
      const boxWidth = 255;
      const boxHeight = 72;

      // Left Box: Billed To
      doc.roundedRect(36, boxY, boxWidth, boxHeight, 6).fillAndStroke('#FBF9F5', '#EBE3D3');
      doc.fillColor('#8A6623').fontSize(8).font('Helvetica-Bold').text('BILLED TO (CUSTOMER)', 46, boxY + 8);
      doc.fillColor('#1A1A1A').fontSize(9.5).font('Helvetica-Bold').text(customerName, 46, boxY + 22);
      doc.fillColor('#555555').fontSize(8).font('Helvetica')
         .text('Mobile: ' + customerPhone, 46, boxY + 36)
         .text('Email: ' + customerEmail, 46, boxY + 48);

      // Right Box: Delivery Destination
      doc.roundedRect(304, boxY, boxWidth, boxHeight, 6).fillAndStroke('#FBF9F5', '#EBE3D3');
      doc.fillColor('#8A6623').fontSize(8).font('Helvetica-Bold').text('DELIVERY / COLLECTION DESTINATION', 314, boxY + 8);
      doc.fillColor('#333333').fontSize(8).font('Helvetica').text(deliveryAddress, 314, boxY + 22, { width: 235, height: 44 });

      // Product Items Table Header
      const tableTop = 202;
      doc.rect(36, tableTop, 523, 20).fill('#1A1423');
      doc.fillColor('#FFFFFF').fontSize(7.5).font('Helvetica-Bold');
      doc.text('S.NO', 42, tableTop + 6, { width: 26, align: 'center' });
      doc.text('ITEM DESCRIPTION & SPECIFICATIONS', 74, tableTop + 6, { width: 210 });
      doc.text('PURITY / WEIGHT', 290, tableTop + 6, { width: 90, align: 'center' });
      doc.text('QTY', 385, tableTop + 6, { width: 28, align: 'center' });
      doc.text('UNIT PRICE', 418, tableTop + 6, { width: 65, align: 'right' });
      doc.text('TOTAL (INR)', 488, tableTop + 6, { width: 65, align: 'right' });

      // Product Items Rows
      let currentY = tableTop + 20;

      items.forEach((item, index) => {
        const itemQty = Number(item.quantity || 1);
        const itemUnitPrice = Number(item.price || 0);
        const itemLineTotal = itemUnitPrice * itemQty;
        const itemName = item.name || 'Signature Jewellery Ornament';
        const specsArr = [];
        if (item.carat) specsArr.push('Purity: ' + item.carat);
        if (item.weight) specsArr.push('Gross Wt: ' + item.weight + 'g');
        if (item.desc) specsArr.push(item.desc);
        const itemSpecs = specsArr.join(' | ');

        const rowHeight = itemSpecs ? 28 : 20;

        if (index % 2 === 1) {
          doc.rect(36, currentY, 523, rowHeight).fill('#FAF8F4');
        }

        doc.strokeColor('#ECE6D8').lineWidth(0.5).moveTo(36, currentY + rowHeight).lineTo(559, currentY + rowHeight).stroke();

        doc.fillColor('#444444').fontSize(8).font('Helvetica').text(String(index + 1), 42, currentY + 5, { width: 26, align: 'center' });
        doc.fillColor('#111111').fontSize(8.5).font('Helvetica-Bold').text(itemName, 74, currentY + 5, { width: 210 });

        if (itemSpecs) {
          doc.fillColor('#777777').fontSize(7).font('Helvetica').text(itemSpecs, 74, currentY + 16, { width: 210, height: 10 });
        }

        const purityDisplay = item.carat || item.weight || 'BIS 916 Gold';
        doc.fillColor('#444444').fontSize(7.5).font('Helvetica').text(purityDisplay, 290, currentY + 5, { width: 90, align: 'center' });
        doc.text(String(itemQty), 385, currentY + 5, { width: 28, align: 'center' });
        doc.text('Rs. ' + itemUnitPrice.toLocaleString('en-IN'), 418, currentY + 5, { width: 65, align: 'right' });
        doc.fillColor('#1A1A1A').font('Helvetica-Bold').text('Rs. ' + itemLineTotal.toLocaleString('en-IN'), 488, currentY + 5, { width: 65, align: 'right' });

        currentY += rowHeight;
      });

      if (items.length === 0) {
        doc.rect(36, currentY, 523, 24).fill('#FFFFFF');
        doc.fillColor('#666666').fontSize(8).text('Bespoke Jewellery Purchase Order', 74, currentY + 7);
        doc.fillColor('#111111').font('Helvetica-Bold').text('Rs. ' + total.toLocaleString('en-IN'), 488, currentY + 7, { width: 65, align: 'right' });
        currentY += 24;
      }

      // Financial Totals Summary
      currentY += 10;
      const totalsStartX = 340;
      const totalsWidth = 219;
      doc.rect(totalsStartX, currentY, totalsWidth, 105).fillAndStroke('#FBF9F5', '#EBE3D3');

      let totY = currentY + 8;
      const drawTotalRow = (label, val, isBold = false, color = '#444444') => {
        doc.fillColor(color).fontSize(8).font(isBold ? 'Helvetica-Bold' : 'Helvetica').text(label, totalsStartX + 10, totY);
        doc.text(val, totalsStartX + 10, totY, { width: totalsWidth - 20, align: 'right' });
        totY += 14;
      };

      drawTotalRow('Taxable Subtotal:', 'Rs. ' + subtotal.toLocaleString('en-IN'));
      if (discount > 0) {
        drawTotalRow('Special Scheme Discount:', '- Rs. ' + discount.toLocaleString('en-IN'), false, '#10B981');
      }
      drawTotalRow('CGST (1.5% Jewelry Tax):', 'Rs. ' + cgst.toLocaleString('en-IN'));
      drawTotalRow('SGST (1.5% Jewelry Tax):', 'Rs. ' + sgst.toLocaleString('en-IN'));
      drawTotalRow('Shipping & Transit Insurance:', 'FREE (Rs. 0)', false, '#10B981');

      doc.strokeColor('#B8893C').lineWidth(1).moveTo(totalsStartX + 10, totY + 2).lineTo(totalsStartX + totalsWidth - 10, totY + 2).stroke();
      totY += 6;
      doc.fillColor('#8A6623').fontSize(10).font('Helvetica-Bold').text('Grand Total:', totalsStartX + 10, totY);
      doc.fillColor('#8A6623').fontSize(11).font('Helvetica-Bold').text('Rs. ' + total.toLocaleString('en-IN'), totalsStartX + 10, totY, { width: totalsWidth - 20, align: 'right' });

      // BIS Hallmark Box
      const termsBoxWidth = 290;
      doc.rect(36, currentY, termsBoxWidth, 105).fillAndStroke('#FBF9F5', '#EBE3D3');
      doc.fillColor('#8A6623').fontSize(7.5).font('Helvetica-Bold').text('BIS HALLMARKING & QUALITY CERTIFICATION', 46, currentY + 8);
      doc.fillColor('#555555').fontSize(6.8).font('Helvetica')
         .text('• All Gold Jewellery is 100% BIS Hallmarked (916 / 750) with unique laser HUID.', 46, currentY + 22, { width: 270 })
         .text('• Natural mined diamonds certified for Cut, Color, Clarity and Carat weight.', 46, currentY + 36, { width: 270 })
         .text('• Lifetime buyback & exchange guarantee available across HR Jewellers showrooms.', 46, currentY + 50, { width: 270 })
         .text('• Transit insured delivery handled by trusted secure bullion logistics.', 46, currentY + 64, { width: 270 })
         .font('Helvetica-Bold').fillColor('#10B981').text('✓ 100% Authenticity & Purity Guaranteed', 46, currentY + 82);

      // Footer Declaration
      const footerY = 740;
      doc.strokeColor('#E2D8C3').lineWidth(0.5).moveTo(36, footerY).lineTo(559, footerY).stroke();
      doc.fillColor('#888888').fontSize(7).font('Helvetica')
         .text('This is a computer-generated official tax invoice and requires no physical signature under Indian Information Technology Act, 2000.', 36, footerY + 8, { align: 'center', width: 523 })
         .text('HR Jewellers & Sons · Station Road, Murti Circle, Bikaner (Rajasthan) 334001 · Customer Care: +91 97838 43978', 36, footerY + 19, { align: 'center', width: 523 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}