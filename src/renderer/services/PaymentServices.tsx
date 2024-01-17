import { handle401Error } from './TokenRefreshServices';

const url = process.env.PAYMENT_SERVICE_API_URL;

export async function withdrawFromContract(
  token: string,
  request: any,
  retryCount = 0
) {
  try {
    console.log('enter');
    const response = await fetch(`${url}/withdraw`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return withdrawFromContract(newToken, request, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    console.log('response', response);
    console.log('response.json()', response.json());
    const res = await response.json();
    console.log('response.detail', res.detail);
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

export async function getContract(token: string, request: any) {
  try {
    const response = await fetch(`${url}/getContract`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function depositToContract(token: string, request: any) {
  try {
    const response = await fetch(`${url}/deposit`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function registerMetamaskAccount(token: string, request: any) {
  try {
    const response = await fetch(`${url}/registerMetamaskAccount`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function getBalance(token: string, request: any) {
  return 100;
}
// export async function depositToContract(token: string, request: any) {
//   try {
//     const response = await fetch(url + '/deposit', {
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify( request ),
//     });
//     if (!response.ok) {
//       throw new Error('Network response not ok');
//     }
//     return response;
//   } catch (error) {
//     console.error('There was a problem with the fetch operation:', error);
//   }
// }
