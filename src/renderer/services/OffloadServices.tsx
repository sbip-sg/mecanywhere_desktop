const url = process.env.REGISTRATION_SERVICE_API_URL;

export default async function offloadTask(token: string, payload: any) {
  const response = await fetch(
    `${url}/offloading/offload_task_and_get_result`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: payload,
  });

  if (!response.ok) {
    throw new Error('Network response not ok');
  }

  const data = await response.json();
  return data;
}
