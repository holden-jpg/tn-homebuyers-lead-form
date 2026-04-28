import { createSalesforceLead, updateSalesforceLead } from './_salesforce.js';
import { sendErrorNotification } from './_email.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      // Honeypot check — bots fill this, humans don't
      if (req.body._hp) {
        return res.json({ success: true, leadId: 'bot' });
      }

      const ipAddress = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
      const result = await createSalesforceLead({ ...req.body, ipAddress });
      return res.json({ success: true, leadId: result.id });
    }

    if (req.method === 'PATCH') {
      const { step, ...formData } = req.body;
      // Extract leadId from the URL — /api/leads/LEADID
      const leadId = req.query.leadId;
      const result = await updateSalesforceLead(leadId, formData, step);
      return res.json({ success: true, leadId: result.id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error.message);

    const step = req.method === 'POST' ? 1 : (req.body?.step || 'unknown');
    const leadId = req.query?.leadId || null;
    sendErrorNotification({ error: error.message, step, formData: req.body || {}, leadId }).catch(console.error);

    return res.status(500).json({ success: false, error: error.message });
  }
}