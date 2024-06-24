import { sendRequest } from './PymecaService';

export async function getTaskListFromContract() {
  try {
    const rawTasks = await sendRequest('get_tasks', {});
    return rawTasks;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Get tasks error:', error.message);
      throw new Error(`Get tasks error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getTaskAdditionFee() {
  try {
    const response = await sendRequest('get_task_addition_fee', {});
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Get task addition fee error:', error.message);
      throw new Error(`Get task addition fee error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
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
    if (error instanceof Error) {
      console.error('Add task error:', error.message);
      throw new Error(`Add task error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}
