export async function sendRequest(functionName: string, args: any) {
  const response = await fetch(`http://localhost:5000/${functionName}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    return response.json().then((data: any) => {
      throw new Error(data.detail);
    });
  }
  return response.json();
}

export async function initActor(actorName: string) {
  const response = await fetch(`http://localhost:5000/init_actor${actorName}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!response.ok) {
    return response.json().then((data: any) => {
      throw new Error(data.detail);
    });
  }
  return response;
}

export async function getAccount() {
  const response = await fetch('http://localhost:5000/get_account', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!response.ok) {
    return response.json().then((data: any) => {
      throw new Error(data.detail);
    });
  }
  return response;
}

export async function cid_from_sha256(sha256: string) {
  try {
    const response = await fetch(
      `http://localhost:5000/cid_from_sha256/${sha256}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      return response.json().then((data: any) => {
        throw new Error(data.detail);
      });
    }
    return response.json();
  } catch (error) {
    console.error('Get cid from sha256 error', error);
  }
}
