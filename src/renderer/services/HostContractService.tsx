import { Tower } from 'renderer/utils/dataTypes';
import { sendRequest, waitForTask } from './PymecaService';

export async function isRegistered() {
  try {
    const response = await sendRequest('is_registered', {});
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Registration error:', error.message);
      throw new Error(`Registration error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function registerHost(
  publicKey: string,
  blockTimeoutLimit: number,
  stake: number
) {
  try {
    await sendRequest('register', {
      public_key: publicKey,
      block_timeout_limit: blockTimeoutLimit,
      initial_deposit: stake,
    });
    console.log('Register successful.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Registration error:', error.message);
      throw new Error(`Registration error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function updateBlockTimeoutLimit(blockTimeoutLimit: number) {
  try {
    await sendRequest('update_block_timeout_limit', {
      new_block_timeout_limit: blockTimeoutLimit,
    });
    console.log('Update successful.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Update error:', error.message);
      throw new Error(`Update error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function updatePublicKey(publicKey: string) {
  try {
    await sendRequest('update_public_key', {
      public_key: publicKey,
    });
    console.log('Update successful.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Update error:', error.message);
      throw new Error(`Update error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getTaskRegisterFee() {
  try {
    const response = await sendRequest('get_task_register_fee', {});
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Get task register fee error:', error.message);
      throw new Error(`Get task register fee error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function addTaskToHost(
  ipfs_sha256: string,
  block_timeout: number,
  fee: number
) {
  try {
    await sendRequest('add_task', {
      ipfs_sha256,
      block_timeout,
      fee,
    });
    console.log('Add task successful.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Add task error:', error.message);
      throw new Error(`Add task error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function deleteTaskFromHost(ipfs_sha256: string) {
  try {
    await sendRequest('delete_task', {
      ipfs_sha256,
    });
    console.log('Delete task successful.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Delete task error:', error.message);
      throw new Error(`Delete task error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getMyTowers(): Promise<Tower[]> {
  try {
    const response = await sendRequest('get_my_towers', {});
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Get my towers error:', error.message);
      throw new Error(`Get my towers error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getHostInitialStake() {
  try {
    const response = await sendRequest('get_host_initial_stake', {});
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Get host initial stake error:', error.message);
      throw new Error(`Get host initial stake error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function registerForTower(tower_address: string) {
  try {
    await sendRequest('register_for_tower', {
      tower_address,
    });
    console.log('Register successful.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Register for tower error:', error.message);
      throw new Error(`Register for tower error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function waitForTasks(
  tower_addresses: string[],
  host_encryption_private_key: string,
  container_name_limit: number,
  resources: any
) {
  try {
    for (let i = 0; i < tower_addresses.length; i++) {
      await waitForTask(
        tower_addresses[i],
        host_encryption_private_key,
        container_name_limit,
        resources
      );
    }
    console.log('Wait for tasks successful.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Wait for tasks error:', error.message);
      throw new Error(`Wait for tasks error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}
