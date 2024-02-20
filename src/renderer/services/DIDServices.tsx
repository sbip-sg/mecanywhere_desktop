const verifier_url = process.env.DID_VERIFIER_SERVICE_API_URL;
const issuer_url = process.env.DID_ISSUER_SERVICE_API_URL;

export async function createDID(publicKey: string): Promise<any> {
  try {
    const response = await fetch(`${verifier_url}/api/v1/did/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicKey }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating DID:', error);
    throw error;
  }
}

export async function verifyCredential(
  verifyCredentialRequest: any
): Promise<any> {
  const response = await fetch(`${verifier_url}/api/v1/did/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verifyCredentialRequest),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function createCredential(
  createCredentialRequest: any
): Promise<any> {
  try {
    const response = await fetch(`${issuer_url}api/v1/did/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createCredentialRequest),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error creating credential:', error);
    throw error;
  }
}
