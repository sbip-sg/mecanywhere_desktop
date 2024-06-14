const transactionUrl = process.env.TRANSACTION_SERVICE_API_URL;

export async function findClientHistory(
  did: string,
  retryCount = 0
) {
  try {
    const response = await fetch(`${transactionUrl}/find_client_history`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        return findClientHistory(did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('There was a problem with the fetch operation:', error.message);
      throw new Error(`There was a problem with the fetch operation: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function findHostHistory(
  did: string,
  retryCount = 0
) {
  try {
    const response = await fetch(`${transactionUrl}/find_host_history`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        return findHostHistory(did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('There was a problem with the fetch operation:', error.message);
      throw new Error(`There was a problem with the fetch operation: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function findPoHistory(
  did: string,
  retryCount = 0
) {
  try {
    const response = await fetch(`${transactionUrl}/find_po_history`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        return findPoHistory(did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('There was a problem with the fetch operation:', error.message);
      throw new Error(`There was a problem with the fetch operation: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}
