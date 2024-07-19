import { sendRequest } from './PymecaService';

export default async function getSentTasks() {
  try {
    const response = await sendRequest('get_sent_tasks', {});
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Get sent tasks error:', error.message);
      throw new Error(`Get sent tasks error: ${error.message}`);
    } else {
      console.error('Unknown Error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}
