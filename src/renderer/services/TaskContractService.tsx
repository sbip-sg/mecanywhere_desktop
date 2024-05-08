import { Task } from '../utils/dataTypes';
import { sendRequest } from './PymecaService';

export async function getTaskListFromContract(provider: any, sender: string) {
  try {
    const rawTasks = await sendRequest('get_tasks', {});
    if (!rawTasks) {
      return [];
    }
    const tasks = rawTasks.map((task: any) => {
      const newTask = {} as Task;
      // TODO: convert sha to cid somewhere
      newTask.cidBytes = task.ipfsSha256;
      newTask.cid = "bafybeial4lhhaemhueafsxlra3sg6a5qo6sxvjiubp3pzlpbgh6w3r3psq";
      newTask.fee = task.fee;
      newTask.sizeIo = task.size;
      const computingTypeNumber = Number(task.computingType);
      if (computingTypeNumber === 0) {
        newTask.computingType = 'CPU';
      } else if (computingTypeNumber === 1) {
        newTask.computingType = 'GPU';
      } else {
        newTask.computingType = 'Unknown';
      }
      return newTask;
    });
    return tasks;
  } catch (error) {
    console.error('Get tasks error', error);
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
  size: number,
  provider: any,
  sender: string
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
