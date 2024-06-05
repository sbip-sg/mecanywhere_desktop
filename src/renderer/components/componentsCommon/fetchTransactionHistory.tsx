import {
  findHostHistory,
  findClientHistory,
} from '../../services/TransactionServices';
import { DataEntry, DataEntryWithoutRole } from '../../utils/dataTypes';

function combineHistories(
  hostDidHistory: DataEntryWithoutRole[],
  clientDidHistory: DataEntryWithoutRole[]
): DataEntry[] {
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
  did: string
): Promise<DataEntry[]> {
  const hostDidHistoryResponse = await findHostHistory(did);
  const clientDidHistoryResponse = await findClientHistory(did);
  const hostDidHistory = await hostDidHistoryResponse?.json();
  const clientDidHistory = await clientDidHistoryResponse?.json();
  return combineHistories(hostDidHistory, clientDidHistory);
}
