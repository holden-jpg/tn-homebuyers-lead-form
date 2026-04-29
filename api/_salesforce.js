import fetch from 'node-fetch';

let cachedToken = null;
let tokenExpiry = null;

export async function getSalesforceToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.SALESFORCE_CLIENT_ID,
    client_secret: process.env.SALESFORCE_CLIENT_SECRET,
  });

  const response = await fetch(
    `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Salesforce auth failed: ${data.error_description}`);
  }

  cachedToken = { token: data.access_token, instanceUrl: data.instance_url };
  tokenExpiry = Date.now() + 90 * 60 * 1000;

  return cachedToken;
}

// ─── Map form data to Salesforce field names ─────────────────────────────────
// Separated out so both create and update use the same mapping

function mapToSalesforceFields(formData, step) {
  const fields = {};

  // Step 1 = lead create: address only, LastName placeholder = property address
  if (step === 1 || step === 'all') {
    Object.assign(fields, {
      FirstName: null,
      LastName: formData.propertyAddress || 'Unknown',
      Property_Address__Street__s: (formData.propertyStreet || formData.propertyAddress || '').substring(0, 80),
      Property_Address__City__s: formData.propertyCity || '',
      Property_Address__StateCode__s: formData.propertyState || '',
      Property_Address__PostalCode__s: formData.propertyZip || '',
      LeadSource: formData.utmSource || 'SEO / Google General Search',
      Lead_Form_Source__c: 'Online',
      UTM_Campaign__c: formData.utmCampaign || '',
      UTM_Term__c: formData.utmTerm || '',
      UTM_Content__c: formData.utmContent || '',
      UTM_Ad_Group__c: formData.utmAdGroup || '',
      Campaign_ID__c: formData.utmId || '',
      GCLID__c: (formData.gclid || '').substring(0, 255),
      FBCLID__c: (formData.fbclid || '').substring(0, 255),
      Lead_Source_URL__c: (formData.sourceUrl || '').substring(0, 255),
      IP_Address__c: formData.ipAddress || '',
    });
  }

  // Step 2 = contact update: replace placeholder LastName with real name
  if (step === 2) {
    const fullNameArray = (formData.fullName || '').split(' ');

    Object.assign(fields, {
      FirstName: fullNameArray.length > 1 ? fullNameArray[0].substring(0, 80) : null,
      LastName: (fullNameArray.length > 1 ? fullNameArray.slice(1).join(' ') : fullNameArray[0]).substring(0, 80),
      Email: formData.email,
      Phone: formData.phone,
    });
  }

  // Step 3 = timeline update
  if (step === 3 || step === 'all') {
    Object.assign(fields, {
      Desired_Closing_Time_Frame__c: formData.timeToSell,
      Sellers_Reason_for_Selling__c: formData.additionalNotes || '',
    });
  }

  return fields;
}

// ─── Step 1: Create the lead ─────────────────────────────────────────────────

export async function createSalesforceLead(formData) {
  const { token, instanceUrl } = await getSalesforceToken();

  const response = await fetch(
    `${instanceUrl}/services/data/v64.0/sobjects/Lead/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapToSalesforceFields(formData, 1)),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Lead creation failed: ${JSON.stringify(error)}`);
  }

  return await response.json(); // { id, success, errors }
}

// ─── Step 2 & 3: Update the lead ─────────────────────────────────────────────

export async function updateSalesforceLead(leadId, formData, step) {
  const { token, instanceUrl } = await getSalesforceToken();

  // Salesforce PATCH returns 204 No Content on success — no response body
  const response = await fetch(
    `${instanceUrl}/services/data/v64.0/sobjects/Lead/${leadId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapToSalesforceFields(formData, step)),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Lead update failed: ${JSON.stringify(error)}`);
  }

  // 204 means success — just return the leadId back
  return { id: leadId, success: true };
}