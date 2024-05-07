export default async function sendRequest(functionName: string, args: any) {
  try {
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
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
