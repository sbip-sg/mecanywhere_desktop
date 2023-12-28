import { handle401Error } from './TokenRefreshServices';

const transactionUrl = process.env.TRANSACTION_SERVICE_API_URL;

export async function recordTask(
  token: string,
  taskDetails: {
    task_type: string;
    did: string;
    po_did: string;
    task_id: string;
    task_metadata: any;
  },
  retryCount = 0
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
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return recordTask(newToken, taskDetails, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function findClientHistory(
  token: string,
  did: string,
  retryCount = 0
) {
  try {
    const response = await fetch(`${transactionUrl}/find_client_history`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return findClientHistory(newToken, did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function findHostHistory(
  token: string,
  did: string,
  retryCount = 0
) {
  try {
    const response = await fetch(`${transactionUrl}/find_host_history`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return findHostHistory(newToken, did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function findPoHistory(
  token: string,
  did: string,
  retryCount = 0
) {
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
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return findPoHistory(newToken, did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function addDummyHistory(
  token: string,
  {
    client_did = null,
    client_po_did = null,
    host_did = null,
    host_po_did = null,
  } = {},
  retryCount = 0
) {
  try {
    const body = JSON.stringify({
      client_did,
      client_po_did,
      host_did,
      host_po_did,
    });

    const response = await fetch(`${transactionUrl}/add_dummy_history`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        // Correctly pass the parameters object when retrying
        return addDummyHistory(
          newToken,
          {
            client_did,
            client_po_did,
            host_did,
            host_po_did,
          },
          retryCount + 1
        );
      }
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function addHostDummyHistory(
  token: string,
  did: string,
  retryCount = 0
) {
  try {
    const response = await fetch(`${transactionUrl}/add_host_dummy_history`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      if (response.status === 401 && retryCount < 1) {
        const newToken = await handle401Error();
        return addHostDummyHistory(newToken, did, retryCount + 1);
      }
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
