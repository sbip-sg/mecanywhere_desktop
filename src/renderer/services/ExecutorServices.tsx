import { ContainerName, ContainerPort } from 'common/dockerNames';
import { ResourcesLog } from 'renderer/utils/dataTypes';
import actions from '../redux/actionCreators';

const host = process.env.TASK_EXECUTOR_HOST || `http://localhost`;
const port = process.env.TASK_EXECUTOR_PORT || ContainerPort.MECA_EXECUTOR_1_PORT;
const url = `${host}:${port}`;

export async function stopExecutor() {
  try {
    actions.setExecutorRunning(false);
    const response = await fetch(`${url}/stop`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to stop executor: ${response.statusText}`);
    }
    const res = await response.json();
    console.log('stopped executor', res);
    return res;
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

export async function unpauseExecutor() {
  try {
    actions.setExecutorRunning(true);
    const response = await fetch(`${url}/unpause`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to unpause executor: ${response.statusText}`);
    }
    console.log('unpaused executor');
    return true;
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

export async function pauseExecutor() {
  try {
    actions.setExecutorRunning(false);
    const response = await fetch(`${url}/pause`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to pause executor: ${response.statusText}`);
    }
    console.log('paused executor');
    return true;
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

export async function updateConfig(config: any) {
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
    if (error instanceof Error) {
      console.error('There was a problem with the fetch operation:', error.message);
      throw new Error(`There was a problem with the fetch operation: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getResourceStats(): Promise<ResourcesLog> {
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
  return {} as ResourcesLog;
}

export async function executeTask({
  containerRef,
  input,
  resource,
  runtime,
  useGpu,
  gpuCount,
  useSgx,
}: {
  containerRef: string;
  input: string;
  resource?: any;
  runtime?: string;
  useGpu?: boolean;
  gpuCount?: number;
  useSgx?: boolean;
}) {
  const content = {
    id: containerRef,
    input,
    resource,
    runtime,
    useGpu,
    gpuCount,
    useSgx,
  };
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  };
  const msg = await fetch(`${url}`, requestOptions)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to execute task: ${res.statusText}`);
      }
      return res.json();
    })
    .then((res) => {
      return res.msg;
    })
    .catch((e) => {
      return e.toString();
    });
  return msg;
}
