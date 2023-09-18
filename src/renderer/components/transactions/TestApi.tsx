import { Typography, Stack, Button } from '@mui/material';
import {
  recordTask,
  findDidHistory,
  findPoHistory,
  addDummyHistory,
} from '../../services/TransactionServices';
import reduxStore from '../../redux/store';

const TestApi = () => {
  const taskInfo = {
    task_type: 'client',
    did: window.electron.store.get('did'),
    po_did: 'did:meca:0x52c328ef8b382b1d71cc262b868d803a137ab8d8',
    task_id: '0x0fa21fd3d11d2cd5e6cdef2c7cd6531a25a5964f',
    task_metadata: {},
  };

  const did = window.electron.store.get('did');

  const podid = 'did:meca:0x52c328ef8b382b1d71cc262b868d803a137ab8d8';

  const checkToken = () => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const did = window.electron.store.get('did');
    const publicKey = window.electron.store.get('publicKey');
    const accessToken = reduxStore.getState().accountUser.hostAccessToken;
    console.log('credential', credential);
    console.log('did', did);
    console.log('publicKey', publicKey);
    console.log('accessToken', accessToken);
  };

  const handleRecordTask = async () => {
    const accessToken = reduxStore.getState().accountUser.hostAccessToken;
    const response = await recordTask(accessToken, taskInfo);
    console.log('response', response);
  };

  const handleFindDidHistory = async () => {
    const accessToken = reduxStore.getState().accountUser.hostAccessToken;
    const response = await findDidHistory(accessToken, did);
    console.log('response', response);
  };

  const handleFindPoHistory = async () => {
    const accessToken = reduxStore.getState().accountUser.hostAccessToken;
    const response = await findPoHistory(accessToken, podid);
    console.log('response', response);
  };

  return (
    <>
      <Button onClick={checkToken}>checkToken</Button>
      <Button onClick={handleRecordTask}>handleRecordTask</Button>
      <Button onClick={handleFindDidHistory}>handleFindDidHistory</Button>
      <Button onClick={handleFindPoHistory}>handleFindPoHistory</Button>
    </>
  );
};

export default TestApi;
