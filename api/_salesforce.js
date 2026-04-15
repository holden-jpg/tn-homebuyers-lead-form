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

  if (step === 1 || step === 'all') {
    const fullNameArray = formData.fullName.split(' ');

    console.log('UTM_Source__c: ', formData.utmSource);
    console.log('UTM_Medium__c: ', formData.utmMedium);
    console.log('UTM_Campaign__c: ', formData.utmCampaign);
    console.log('UTM_Term__c: ', formData.utmTerm);
    console.log('UTM_Content__c: ', formData.utmContent);

    Object.assign(fields, {
      FirstName: (fullNameArray.length > 1 ? fullNameArray[0] : null),
      LastName: (fullNameArray.length > 1 ? fullNameArray.slice(1).join(' ') : fullNameArray[0]),
      Email: formData.email,
      Phone: formData.phone,
      LeadSource: formData.utmSource || '',
      UTM_Campaign__c: formData.utmCampaign || '',
      UTM_Term__c: formData.utmTerm || '',
      UTM_Content__c: formData.utmContent || '',
      UTM_Ad_Group__c: formData.utmAdGroup || '',
      Campaign_ID__c: formData.utmId || '',
      GCLID__c: formData.gclid || '',
      FBCLID__c: formData.fbclid || '',
      Lead_Source_URL__c: formData.sourceUrl || '',
      IP_Address__c: formData.ipAddress || ''
    });
  }

  if (step === 2 || step === 'all') {
    const streetAddress = (!!formData.addressLine1 ? (!!formData.addressLine2 ? formData.addressLine1 + '\n' + formData.addressLine2 : formData.addressLine1) : '');

    Object.assign(fields, {
      Property_Address__Street__s: streetAddress,
      Property_Address__City__s: formData.city,
      Property_Address__StateCode__s: formData.state,
      Property_Address__PostalCode__s: formData.zipCode,
    });
  }

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