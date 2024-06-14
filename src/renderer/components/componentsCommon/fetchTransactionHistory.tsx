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
  try {
    const hostDidHistoryResponse = await findHostHistory(did);
    const clientDidHistoryResponse = await findClientHistory(did);
    const hostDidHistory = await hostDidHistoryResponse?.json();
    const clientDidHistory = await clientDidHistoryResponse?.json();
    return combineHistories(hostDidHistory, clientDidHistory);
  } catch (error) {
    if (error instanceof Error) {
      console.error('There was a problem with the fetching transaction history:', error.message);
      throw new Error(`There was a problem with the fetching transaction history: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}
