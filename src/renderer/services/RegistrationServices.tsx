import { handle401Error } from './TokenRefreshServices';

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
    return res;
  } catch (error) {
    throw error;
  }
}

export async function heartbeat(token: string, did: string, retryCount = 0) {
  try {
    const response = await fetch(`${url}/heartbeat`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return heartbeat(newToken, did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return response.ok;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function authenticate(did: string, credential: object) {
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
  }
}

export async function registerHost(
  token: string,
  did: string,
  cpu: number,
  memory: number,
  retryCount = 0
) {
  try {
    const response = await fetch(`${url}/registration/register_host`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did, resources: { cpu, memory } }),
    });

    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return registerHost(newToken, did, cpu, memory, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function deregisterHost(
  token: string,
  did: string,
  retryCount = 0
) {
  try {
    const response = await fetch(`${url}/registration/deregister_host`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return deregisterHost(newToken, did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
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

// export async function createChallenge(data: any): Promise<any> {
//   try {
//     const response = await fetch(`${url}/create_challenge/`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error('Network response not ok');
//     }
//     const res = await response.json();
//     return res;
//   } catch (error) {
//     throw new Error('Network error occurred');
//   }
// }

// export async function verifyResponse(data: any): Promise<any> {
//   try {
//     const response = await fetch(`${url}/verify_response/`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error('Network response not ok');
//     }
//     const res = await response.json();
//     return res;
//   } catch (error) {
//     console.error('There was a problem with the fetch operation:', error);
//   }
// }
