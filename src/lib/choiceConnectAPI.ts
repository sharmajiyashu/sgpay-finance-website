export const CHOICE_CONNECT_BASE_URL = process.env.NEXT_PUBLIC_CHOICE_CONNECT_BASE_URL || "https://choiceconnect.in";
export const CHOICE_CONNECT_API_URL = `${CHOICE_CONNECT_BASE_URL}/sso/connect-partners/v1`;

interface PartnerConfig {
  partnerCode: string;
  oprId: string;
  secretKey: string;
}

export const DEFAULT_PARTNER_CONFIG: PartnerConfig = {
  partnerCode: process.env.NEXT_PUBLIC_CHOICE_CONNECT_CLIENT_CODE || "t girshapay",
  oprId: process.env.CHOICE_CONNECT_SUBJECT_ID || "a5581ae9-dc1f-458c-b05e-6366321a8fa4",
  secretKey: process.env.CHOICE_CONNECT_SECRET_KEY || "5_*LtH29?u53Wi?8fi0OmEt557EsP-kib@pha!hoYI9r0N6yifrapoz_F@$_h_t@"
};

/**
 * 1. Redirection Journey/Connect Login
 * Validates Hash and redirects user.
 */
export async function generateSSOLoginPayload(config: PartnerConfig, userType: string = "partner_id") {
  // Logic to generate the hash using the secret key based on Choice Connect logic
  // e.g., SHA256(OPRID + UserType + RequestNumber + SecretKey)
  
  const uniqueRequestNumber = Date.now().toString();
  
  // Note: For a real integration, the hash should ideally be generated server-side 
  // to avoid exposing the secretKey in the frontend.
  // const hash = generateHash(config.oprId, userType, uniqueRequestNumber, config.secretKey);
  const hash = "GENERATED_HASH_HERE";

  return {
    opr_id: config.oprId,
    user_type: userType,
    request_number: uniqueRequestNumber,
    hash: hash
  };
}

/**
 * 2. User Onboarding
 * Registers a partner's user (agent) in the Choice Connect portal.
 */
export async function onboardUser(authToken: string, agentDetails: any) {
  const url = `${CHOICE_CONNECT_API_URL}/partner-integration/onboard`; // Example endpoint
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(agentDetails)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to onboard user: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * 3. Summary Report API
 * Fetch a consolidated report of all enquiries/submitted leads.
 */
export async function getSummaryReport(authToken: string, filters?: any) {
  const url = `${CHOICE_CONNECT_API_URL}/summary-report`; // Example endpoint
  
  const response = await fetch(url, {
    method: "POST", // The doc says POST for summary
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(filters || {})
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get summary report: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * 4. Referral Link API
 * Generate unique product-wise referral links.
 */
export async function generateReferralLink(authToken: string, ssoSubjectId: string, agentCode?: string) {
  const url = `${CHOICE_CONNECT_API_URL}/generate-referral-link`; // Based on API Doc link in PDF
  
  const payload = {
    sso_subject_id: ssoSubjectId,
    agent_code: agentCode
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate referral link: ${response.statusText}`);
  }
  
  return response.json();
}
