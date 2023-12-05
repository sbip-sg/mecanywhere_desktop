import reduxStore from '../redux/store';
import actions from '../redux/actionCreators';

const url = process.env.REGISTRATION_SERVICE_API_URL;

export async function refreshAccess(refreshToken: string) {
  console.log('attempt refresh with refresh_token: ', refreshToken);
  try {
    const urlWithParams = new URL(`${url}/authentication/refresh_access`);
    urlWithParams.searchParams.append('refresh_token', refreshToken);

    const response = await fetch(urlWithParams.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function handle401Error() {
  const { refreshToken } = reduxStore.getState().userReducer;
  const { access_token } = await refreshAccess(refreshToken);
  console.log('new_access_token', access_token);
  actions.setAccessToken(access_token);
  return access_token;
}
