import { sendRequest } from './PymecaService';

export async function getTaskListFromContract() {
  try {
    const rawTasks = await sendRequest('get_tasks', {});
    return rawTasks;
  } catch (error) {
    console.error('Get tasks error', error);
  }
}

export async function cid_from_sha256(sha256: string) {
  try {
    const response = await sendRequest('cid_from_sha256', { sha256 });
    return response;
  } catch (error) {
    console.error('Get cid from sha256 error', error);
  }
}

export async function getTaskAdditionFee() {
  try {
    const response = await sendRequest('get_task_addition_fee', {});
    return response;
  } catch (error) {
    console.error('Get task addition fee error', error);
  }
}

export async function addTaskByDeveloper(
  ipfsSha256: string,
  fee: number,
  computingType: number,
  size: number
) {
  try {
    await sendRequest('add_task', {
      ipfsSha256,
      fee,
      computingType,
      size,
    });
    console.log('Add task successful.');
    return true;
  } catch (error) {
    console.error('Add task error', error);
  }
}
