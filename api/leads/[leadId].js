import { updateSalesforceLead } from '../_salesforce.js';
import { sendErrorNotification } from '../_email.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { leadId } = req.query;
    const { step, ...formData } = req.body;
    const result = await updateSalesforceLead(leadId, formData, step);
    return res.json({ success: true, leadId: result.id });
  } catch (error) {
    console.error('Lead update error:', error.message);
    const { leadId } = req.query;
    const { step, ...formData } = req.body;
    sendErrorNotification({ error: error.message, step, formData, leadId }).catch(console.error);
    return res.status(500).json({ success: false, error: error.message });
  }
}