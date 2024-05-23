import { DataEntry } from '../../utils/dataTypes';

const dummyData: DataEntry[] = [];

function generateRandomDataEntry(): DataEntry {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1).getTime();
  const endOfYear = new Date(currentYear, 11, 31).getTime();
  const transactionStartDatetime = Math.random() * (endOfYear - startOfYear) + startOfYear;
  const transactionEndDatetime = Math.random() * (endOfYear - transactionStartDatetime) + transactionStartDatetime;

  const transactionStartEpoch = Math.floor(transactionStartDatetime / 1000);
  const transactionEndEpoch = Math.floor(transactionEndDatetime / 1000);

  const dataEntry: DataEntry = {
    duration: Math.random() * 1000,
    network_reliability: Math.random(),
    price: Math.random() * 100,
    resource_cpu: Math.random() * 10,
    resource_memory: Math.random() * 1000,
    role: Math.random() < 0.5 ? 'host' : 'client',
    task_name: 'randomTask',
    transaction_end_datetime: transactionEndEpoch,
    transaction_start_datetime: transactionStartEpoch,
    transaction_id: Math.random().toString(),
  };

  return dataEntry;
}

// Generate 10 random DataEntry objects and add them to the dummyData array
for (let i = 0; i < 10; i++) {
  dummyData.push(generateRandomDataEntry());
}

export default dummyData;
