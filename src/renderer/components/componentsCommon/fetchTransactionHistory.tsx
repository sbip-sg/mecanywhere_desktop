import getSentTasks from 'renderer/services/UserContractService';
import { getReceivedTasks } from 'renderer/services/HostContractService';
import { DataEntry, Event } from '../../utils/dataTypes';
import { cid_from_sha256, getBlockTimestamp, getFinishedTasks, initActor } from 'renderer/services/PymecaService';
import { retrieveIPFSFolderMetadata } from 'renderer/services/IPFSService';

async function joinSentFinishedEvents(
  sent: Event,
  finished: Event,
  role: 'host' | 'client'
): Promise<DataEntry> {
  const fees: Record<string, number> = finished.args.fee;
  if (fees === undefined) {
    throw new Error('Fee is undefined');
  }
  let price;
  if (role === 'host') {
    price = fees.host;
  } else {
    price = Object.values(fees).reduce((acc: number, fee) => acc + fee, 0);
  }
  const cid = await cid_from_sha256(`0x${sent.args.ipfsSha256}`);
  const { name } = await retrieveIPFSFolderMetadata(cid);
  const resourceFile = await window.electron.catFile(cid, 'config.json');
  const resourceFileContent = JSON.parse(resourceFile);
  const transaction_end_datetime = await getBlockTimestamp(finished.blockNumber);
  const transaction_start_datetime = await getBlockTimestamp(sent.blockNumber);
  const duration = transaction_end_datetime - transaction_start_datetime;
  return {
    duration,
    price,
    resource_cpu: resourceFileContent.resource?.cpu,
    resource_memory: resourceFileContent.resource?.mem,
    role,
    task_name: name.trim(),
    transaction_end_datetime,
    transaction_start_datetime,
    transaction_id: finished.transactionHash,
  };
}

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
  const dataEntries: Promise<DataEntry>[] = [];
  finishedTasks.forEach(async (finishedTask) => {
    const hostEvent = hostEventMap.get(finishedTask.args.taskId);
    if (hostEvent) {
      dataEntries.push(joinSentFinishedEvents(hostEvent, finishedTask, 'host'));
    }
    const clientEvent = clientEventMap.get(finishedTask.args.taskId);
    if (clientEvent) {
      dataEntries.push(joinSentFinishedEvents(clientEvent, finishedTask, 'client'));
    }
    return dataEntries;
  })
  return Promise.all(dataEntries)
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
