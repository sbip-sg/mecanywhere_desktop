const url = process.env.TASK_EXECUTOR_URL;

export async function stopExecutor() {
  try {
    const response = await fetch(`${url}/stop`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to stop executor: ${response.statusText}`
      );
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function unpauseExecutor() {
  try {
    const response = await fetch(`${url}/unpause`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to unpause executor: ${response.statusText}`);
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function pauseExecutor() {
  try {
    const response = await fetch(`${url}/pause`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to pause executor: ${response.statusText}`);
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function updateConfig(config) {
  try {
    const response = await fetch(`${url}/update-config`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    if (!response.ok) {
      throw new Error(`Failed to update configuration: ${response.statusText}`);
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function getResourceStats() {
  try {
    const response = await fetch(`${url}/stats`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to get resource statistics: ${response.statusText}`
      );
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
