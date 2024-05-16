const url = process.env.PYMECA_ACTOR_SERVER_URL;

export async function sendRequest(functionName: string, args: any) {
  const response = await fetch(`${url}/${functionName}`, {
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
  const response = await fetch(`${url}/init_actor/${actorName}`, {
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

export async function closeActor() {
  const response = await fetch(`${url}/close_actor`, {
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
  const response = await fetch(`${url}/get_account`, {
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
      `${url}/cid_from_sha256/${sha256}`,
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
