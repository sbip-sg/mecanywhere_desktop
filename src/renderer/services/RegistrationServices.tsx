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

export async function heartbeat(token: string, did: string) {
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
    console.log('response', res.refresh_token);
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function refreshAccess(refreshToken: string) {
  try {
    const response = await fetch(`${url}/authentication/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    const res = await response.json();
    console.log('response1', res.refresh_token);
    console.log('response2', res.access_token);
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}


export async function registerHost(token: string, did: string) {
  try {
    const response = await fetch(`${url}/registration/register_host`, {
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

export async function deregisterHost(token: string, did: string) {
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
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// export async function registerClient(token: string, did: string) {
//   try {
//     const response = await fetch(`${url}/registration/register_client`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ did }),
//     });

//     if (!response.ok) {
//       throw new Error('Network response not ok');
//     }
//     return true;
//   } catch (error) {
//     console.error('There was a problem with the fetch operation:', error);
//   }
// }

// export async function deregisterClient(token: string, did: string) {
//   try {
//     const response = await fetch(`${url}/registration/deregister_client`, {
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ did }),
//     });
//     if (!response.ok) {
//       throw new Error('Network response not ok');
//     }
//     return true;
//   } catch (error) {
//     console.error('There was a problem with the fetch operation:', error);
//   }
// }

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
