import {
  findHostHistory,
  findClientHistory,
} from '../../services/TransactionServices';
import { DataEntry, DataEntryWithoutRole } from './dataTypes';

function combineHistories(
  hostDidHistory: DataEntryWithoutRole[],
  clientDidHistory: DataEntryWithoutRole[]
): DataEntry[] {
  console.log('hostDidHistory', hostDidHistory);
  const hostWithRole = hostDidHistory.map((item) => ({
    ...item,
    role: 'host',
  }));
  const clientWithRole = clientDidHistory.map((item) => ({
    ...item,
    role: 'client',
  }));
  return [...hostWithRole, ...clientWithRole];
}

export default async function fetchTransactionHistory(
  accessToken: string,
  did: string
): Promise<DataEntry[]> {
  const hostDidHistoryResponse = await findHostHistory(accessToken, did);
  const clientDidHistoryResponse = await findClientHistory(accessToken, did);
  const hostDidHistory = await hostDidHistoryResponse?.json();
  const clientDidHistory = await clientDidHistoryResponse?.json();
  return combineHistories(hostDidHistory, clientDidHistory);
}
