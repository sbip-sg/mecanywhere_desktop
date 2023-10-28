const transactionUrl = process.env.TRANSACTION_SERVICE_API_URL;

export async function recordTask(
  token: string,
  taskDetails: {
    task_type: string;
    did: string;
    po_did: string;
    task_id: string;
    task_metadata: any;
  }
) {
  try {
    const response = await fetch(`${transactionUrl}/record_task`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskDetails),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function findDidHistory(token: string, did: string) {
  try {
    const response = await fetch(`${transactionUrl}/find_did_history`, {
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
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function findPoHistory(token: string, did: string) {
  try {
    const response = await fetch(`${transactionUrl}/find_po_history`, {
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
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function addDummyHistory(token: string, did: string) {
  try {
    const response = await fetch(`${transactionUrl}/add_dummy_history`, {
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
