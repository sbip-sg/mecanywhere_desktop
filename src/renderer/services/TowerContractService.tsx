import { sendRequest } from './PymecaService';

export async function getHostRequestFee() {
  try {
    const response = await sendRequest('get_host_request_fee', {});
    return response;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function registerMeForTower(
  towerAddress: string,
  provider: any,
  sender: string
) {
  try {
    await sendRequest('register_me_for_tower', {
      towerAddress,
    });
    console.log('Register successful.');
    return true;
  } catch (error) {
    console.error('Register error', error);
  }
}

export async function getTowers(provider: any) {
  try {
    const response = await sendRequest('get_towers', {});
    return response;
  } catch (error) {
    console.error('Get towers error', error);
  }
}
