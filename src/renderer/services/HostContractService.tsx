import { sendRequest } from './PymecaService';

export async function registerHost(
  publicKeyByteArray: string[],
  blockTimeoutLimit: number,
  stake: number
) {
  try {
    await sendRequest('register', {
      publicKeyByteArray,
      blockTimeoutLimit,
      stake,
    });
    console.log('Register successful.');
    return true;
  } catch (error) {
    console.error('Register error', error);
  }
}

export async function updateBlockTimeoutLimit(
  blockTimeoutLimit: number
) {
  try {
    await sendRequest('update_block_timeout_limit', {
      blockTimeoutLimit,
    });
    console.log('Update successful.');
    return true;
  } catch (error) {
    console.error('Update error', error);
  }
}

export async function getTaskRegisterFee() {
  try {
    const response = await sendRequest('get_task_register_fee', {});
    return response;
  } catch (error) {
    console.error('Get task register fee error', error);
  }
}

export async function addTaskToHost(
  ipfs_hash: string,
  block_timeout: number,
  task_fee: number
) {
  try {
    await sendRequest('add_task', {
      ipfs_hash,
      block_timeout,
      task_fee,
    });
    console.log('Add task successful.');
    return true;
  } catch (error) {
    console.error('Add task error', error);
  }
}

export async function deleteTask(
  task_hash: string
) {
  try {
    await sendRequest('delete_task', {
      task_hash,
    });
    console.log('Delete task successful.');
    return true;
  } catch (error) {
    console.error('Delete task error', error);
  }
}
