import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAILS = [
  'holden@615house.com',
  'erin@615house.com',
  'samatha@615house.com',
];

export async function sendErrorNotification({ error, step, formData = {}, leadId = null }) {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

  const rows = [
    ['Time', timestamp],
    ['Step', step],
    ['Lead ID', leadId || 'Not created yet'],
    ['Error', error],
    ['Property Address', formData.propertyAddress || '—'],
    ['Name', formData.fullName || '—'],
    ['Email', formData.email || '—'],
    ['Phone', formData.phone || '—'],
    ['Source URL', formData.sourceUrl || '—'],
    ['IP Address', formData.ipAddress || '—'],
  ]
    .map(([label, value]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap">${label}</td><td style="padding:6px 12px;color:#222">${value}</td></tr>`)
    .join('');

  await resend.emails.send({
    from: 'TN Homebuyers Form <noreply@615house.com>',
    to: NOTIFY_EMAILS,
    subject: `Form Error — Step ${step}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#002192;padding:20px 24px;border-radius:8px 8px 0 0">
          <h2 style="color:#fff;margin:0;font-size:18px">TN Homebuyers Form Error</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#f9f9f9;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          ${rows}
        </table>
      </div>
    `,
  });
}
