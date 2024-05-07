import sendRequest from './PymecaService';

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
    console.error('Send task error', error);
  }
};