const url = process.env.REGISTRATION_SERVICE_API_URL;

export async function createAccount(data) {
  try {
    const response = await fetch(url + '/create_account', {
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
    return res;
  } catch (error) {
    console.error('There was a problem withas the fetch operation:', error);
  }
}

export async function createChallenge(data) {
  try {
    const response = await fetch(url + '/create_challenge', {
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
    return res;
  } catch (error) {
    console.error('There was a problem withas the fetch operation:', error);
  }
}

export async function verifyResponse(data) {
  try {
    const response = await fetch(url + '/verify_response', {
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
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function heartbeat(token: string, did: string) {
  try {
    const response = await fetch(url + '/heartbeat', {
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
    return response.ok;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function assignHost(token: string, did: string) {
  try {
    const response = await fetch(url + '/assign_host', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did: did }),
    });
    if (!response.ok) {
      throw new Error(`Failed to assign host: ${response.statusText}`);
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function registerHost(did: string, credential: object) {
  try {
    const response = await fetch(url + '/registration/register_host', {
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
  }
}

export async function deregisterHost(token: string, did: string) {
  try {
    const response = await fetch(url + '/registration/deregister_host', {
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
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function registerUser(did: string, credential: object) {
  try {
    const response = await fetch(url + '/registration/register_user', {
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
  }
}

export async function deregisterUser(token: string, did: string) {
  try {
    const response = await fetch(url + '/registration/deregister_user', {
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
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
