const url = process.env.REGISTRATION_SERVICE_API_URL;

export async function createAccount(data: any): Promise<any> {
  try {
    const response = await fetch(`${url}/create_account/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    const res = await response.json();
    console.log('account res', res);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function authenticate(did: string, credential: object) {
  console.log('did', did);
  console.log('credential', credential);
  try {
    const response = await fetch(`${url}/authentication/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ did, credential }),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return { error };
  }
}

export async function registerHost(
  publicKey: string,
  publicKeyType: number,
  blockTimeoutLimit: number,
  provider: any,
  sender: string,
  retryCount = 0
) {
  return false;
}

export async function deregisterHost(
  provider: any,
  host: string,
  sender: string,
  retryCount = 0
) {
  return false;
}

export async function registerClient(token: string, did: string) {
  try {
    const response = await fetch(`${url}/registration/register_client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });

    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function deregisterClient(token: string, did: string) {
  try {
    const response = await fetch(`${url}/registration/deregister_client`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
