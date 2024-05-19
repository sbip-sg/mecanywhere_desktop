import { Tower } from 'renderer/utils/dataTypes';
import { sendRequest } from './PymecaService';

export async function getHostRequestFee() {
  try {
    const response = await sendRequest('get_host_request_fee', {});
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function getTowers(): Promise<Tower[]> {
  try {
    const response = await sendRequest('get_towers', {});
    return response;
  } catch (error) {
    console.error('Get towers error', error);
  }
  return [];
}
