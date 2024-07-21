import getSentTasks from 'renderer/services/UserContractService';
import { getReceivedTasks } from 'renderer/services/HostContractService';
import { DataEntry, Event } from '../../utils/dataTypes';
import { cid_from_sha256, getFinishedTasks, initActor } from 'renderer/services/PymecaService';
import { retrieveIPFSFolderMetadata } from 'renderer/services/IPFSService';

async function combineEvents(
  hostEvents: Event[],
  clientEvents: Event[],
  finishedTasks: Event[]
): Promise<DataEntry[]> {
  const hostEventMap = new Map<string, Event>(
    hostEvents.map((item) => [item.args.taskId, item])
  );
  const clientEventMap = new Map<string, Event>(
    clientEvents.map((item) => [item.args.taskId, item])
  );
  const combinedHistory = finishedTasks
    .flatMap(async (finishedTask) => {
      const events: Event[] = [];
      const hostEvent = hostEventMap.get(finishedTask.args.taskId);
      if (hostEvent) {
        events.push(hostEvent);
      }
      const clientEvent = clientEventMap.get(finishedTask.args.taskId);
      if (clientEvent) {
        events.push(clientEvent);
      }
      const dataEntries: DataEntry[] = [];
      events.forEach(async (event) => {
        const fees: Record<string, number> = finishedTask.args.fee;
        if (fees === undefined) {
          throw new Error('Fee is undefined');
        }
        const price = Object.values(fees).reduce(
          (acc: number, fee) => acc + fee,
          0
        );
        const cid = await cid_from_sha256(`0x${event.args.ipfsSha256}`);
        const { name } = await retrieveIPFSFolderMetadata(cid);
        const resourceFile = await window.electron.catFile(cid, 'config.json');
        const resourceFileContent = JSON.parse(resourceFile);
        const dataEntry = {
          duration: finishedTask.blockNumber - event.blockNumber,
          price,
          resource_cpu: resourceFileContent.resource?.cpu,
          resource_memory: resourceFileContent.resource?.mem,
          role: finishedTask.args.taskId in hostEventMap ? 'host' : 'client',
          task_name: name.trim(),
          transaction_end_datetime: finishedTask.blockNumber,
          transaction_start_datetime: event.blockNumber,
          transaction_id: finishedTask.transactionHash,
        };
        dataEntries.push(dataEntry);
      });
      return dataEntries;
    })
    .filter((item) => item !== undefined);
  return Promise.all(combinedHistory)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export default async function fetchTransactionEvents(): Promise<DataEntry[]> {
  try {
    await initActor('user');
    const clientEvents = await getSentTasks();
    const finishedTasks = await getFinishedTasks();
    await initActor('host');
    const hostEvents = await getReceivedTasks();

    return await combineEvents(hostEvents, clientEvents, finishedTasks);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'There was a problem with the fetching transaction events:',
        error.message
      );
      throw new Error(
        `There was a problem with the fetching transaction events: ${error.message}`
      );
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}
