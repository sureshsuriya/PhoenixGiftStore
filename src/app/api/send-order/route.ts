import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');

function saveOrder(order: Record<string, unknown>) {
  try {
    if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]', 'utf8');
    const existing = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
    existing.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(existing, null, 2), 'utf8');
  } catch (e) { console.error('Failed to save order:', e); }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, address, city, state, pincode, items, total, note, occasion, customText, imageFileName, imageData } = body;

  const itemsHtml = items.map((item: { title: string; qty: number; price: number }) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;">${item.title}</td>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.qty}</td>
      <td style="padding:10px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;">₹${item.price * item.qty}</td>
    </tr>
  `).join('');

  const customizationHtml = `
    <h2 style="font-size:18px;margin:28px 0 20px;color:#1f2937;border-bottom:2px solid #f3f4f6;padding-bottom:12px;">🎨 Customization Details</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Occasion</td><td style="padding:8px 0;font-weight:700;color:#be123c;">${occasion || 'Not specified'}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Custom Message</td><td style="padding:8px 0;font-weight:600;color:#111827;white-space:pre-wrap;">${customText || 'Not provided'}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Photo File</td><td style="padding:8px 0;font-weight:600;color:#111827;">${imageFileName || 'Not uploaded'}</td></tr>
    </table>
    ${imageData ? `<div style="margin-top:12px;"><p style="font-size:13px;color:#6b7280;margin-bottom:8px;">📸 Customer's uploaded photo:</p><img src="${imageData}" style="max-width:200px;border-radius:10px;border:2px solid #f3f4f6;" alt="Customer Photo" /></div>` : ''}
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f8f8f8;">
      <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#f43f5e,#be123c);padding:40px 32px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:28px;letter-spacing:-0.5px;">🔥 Pheonix Gifts</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">New Order Received!</p>
        </div>

        <!-- Order Alert -->
        <div style="background:#fff7f8;border-left:4px solid #f43f5e;padding:20px 32px;margin:0;">
          <p style="margin:0;font-size:15px;color:#be123c;font-weight:600;">📦 A new courier order has been placed!</p>
        </div>

        <!-- Customer Details -->
        <div style="padding:32px;">
          <h2 style="font-size:18px;margin:0 0 20px;color:#1f2937;border-bottom:2px solid #f3f4f6;padding-bottom:12px;">👤 Customer Details</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;color:#111827;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;font-weight:600;color:#111827;">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;font-weight:600;color:#111827;">${email || 'Not provided'}</td></tr>
          </table>

          <h2 style="font-size:18px;margin:28px 0 20px;color:#1f2937;border-bottom:2px solid #f3f4f6;padding-bottom:12px;">📍 Delivery Address</h2>
          <div style="background:#f9fafb;border-radius:10px;padding:16px;font-size:14px;line-height:1.8;color:#374151;">
            ${address}<br/>
            ${city}, ${state} - ${pincode}
          </div>

          ${note ? `<div style="margin-top:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;font-size:14px;color:#92400e;"><strong>📝 Note:</strong> ${note}</div>` : ''}

          ${customizationHtml}

          <h2 style="font-size:18px;margin:28px 0 20px;color:#1f2937;border-bottom:2px solid #f3f4f6;padding-bottom:12px;">🛍️ Order Items</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:12px 10px;text-align:left;color:#6b7280;font-weight:600;">Product</th>
                <th style="padding:12px 10px;text-align:center;color:#6b7280;font-weight:600;">Qty</th>
                <th style="padding:12px 10px;text-align:right;color:#6b7280;font-weight:600;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <!-- Total -->
          <div style="margin-top:20px;background:linear-gradient(135deg,#fff7f8,#fff);border:2px solid #f43f5e;border-radius:12px;padding:20px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:16px;font-weight:600;color:#374151;">Total Amount</span>
            <span style="font-size:24px;font-weight:800;color:#be123c;">₹${total}</span>
          </div>

          <!-- Delivery Note -->
          <div style="margin-top:24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;font-size:13px;color:#166534;">
            🚚 <strong>Courier Service:</strong> Package will be dispatched via courier within 2-3 business days. Customer will receive tracking details on their phone.
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">Built by <strong style="color:#f43f5e;">Triple Tech Phoenix</strong> | Pheonix Gifts Admin System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Always save the order first (even if email fails)
  const orderId = `PHX-${Date.now().toString().slice(-6)}`;
  saveOrder({
    id: orderId,
    name, phone, email, address, city, state, pincode,
    occasion, customText, note,
    imageFileName: imageFileName || null,
    items, total,
    status: 'Processing',
    placedAt: new Date().toISOString(),
  });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Pheonix Gifts Orders" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🔥 New Order ${orderId} from ${name} — ₹${total}`,
      html,
    });

    if (email) {
      await transporter.sendMail({
        from: `"Pheonix Gifts" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `✅ Order ${orderId} Confirmed — Pheonix Gifts`,
        html: `
          <div style="max-width:500px;margin:0 auto;font-family:Arial,sans-serif;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f3f4f6;">
            <div style="background:linear-gradient(135deg,#f43f5e,#be123c);padding:32px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:24px;">🔥 Pheonix Gifts</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Your order is confirmed!</p>
            </div>
            <div style="padding:32px;">
              <p style="font-size:16px;color:#374151;">Hi <strong>${name}</strong>,</p>
              <p style="color:#6b7280;line-height:1.7;">Thank you for ordering from Pheonix Gifts! 🎁 Your order <strong>${orderId}</strong> for <strong>₹${total}</strong> will be dispatched via courier within <strong>2-3 business days</strong>.</p>
              <p style="color:#6b7280;">Questions? DM us on Instagram <strong>@Pheonix._.gifts</strong></p>
              <p style="color:#374151;font-weight:600;margin-top:24px;">With love, Team Pheonix Gifts 💝</p>
              <p style="font-size:12px;color:#9ca3af;margin-top:16px;">Built by Triple Tech Phoenix</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('Email error (order saved):', err);
    // Order was saved — return success anyway, email is optional
    return NextResponse.json({ success: true, orderId, emailError: true });
  }
}
