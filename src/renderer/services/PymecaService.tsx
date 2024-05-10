export async function sendRequest(functionName: string, args: any) {
  const response = await fetch(`http://localhost:5000/${functionName}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    throw new Error('Network response not ok');
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
    throw new Error('Network response not ok');
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
    throw new Error('Network response not ok');
  }
  return response;
}
