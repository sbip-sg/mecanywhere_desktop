const url = process.env.PAYMENT_SERVICE_API_URL;

export async function withdrawFromContract(token: string, request: any) {
  try {
    const response = await fetch(url + '/withdraw', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify( request ),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function getContract(token: string, request: any) {
  try {
    const response = await fetch(url + '/getContract', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify( request ),
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
    const response = await fetch(url + '/deposit', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify( request ),
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
    const response = await fetch(url + '/registerMetamaskAccount', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify( request ),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
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
