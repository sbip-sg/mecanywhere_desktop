import { Tower } from 'renderer/utils/dataTypes';
import { sendRequest } from './PymecaService';

export async function getHostRequestFee() {
  try {
    const response = await sendRequest('get_host_request_fee', {});
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('There was a problem with the fetch operation:', error.message);
      throw new Error(`There was a problem with the fetch operation: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getTowers(): Promise<Tower[]> {
  try {
    const response = await sendRequest('get_towers', {});
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Get towers error:', error.message);
      throw new Error(`Get towers error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}
