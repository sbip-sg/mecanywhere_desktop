import { sendRequest } from './PymecaService';

export async function isRegistered() {
  try {
    const response = await sendRequest('is_registered', {});
    return response;
  } catch (error) {
    console.error('Is registered error', error);
  }
}

export async function registerHost(
  publicKey: string[],
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
    console.error('Register error', error);
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
