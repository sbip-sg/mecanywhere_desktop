import { sendRequest } from './PymecaService';

export default async function sendTask(
  ipfsSha256: string,
  hostAddress: string,
  towerAddress: string,
  input: any,
  provider: any,
  sender: string
) {
  try {
    await sendRequest('send_task', {
      ipfsSha256,
      hostAddress,
      towerAddress,
      input,
    });
    console.log('Send task successful.');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Send task error:', error.message);
      throw new Error(`Send task error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
};
