import { Typography, Stack, Button } from '@mui/material';
import {
  recordTask,
  findDidHistory,
  findPoHistory,
  addDummyHistory,
} from '../../services/TransactionServices';
import reduxStore from '../../redux/store';
import { useState, useEffect } from 'react';

const TestApi = () => {
  const [accessToken, setAccessToken] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [error, setError] = useState(null);
  const [a, setA] = useState(null);

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
    // setAccessToken(accessToken);
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
    try {
      setError(null); // Clear any previous errors
      const accessToken = reduxStore.getState().accountUser.hostAccessToken;
      setAccessToken(accessToken);
      const response = await findDidHistory(accessToken, did);
      setA(response?.status);
      if (!response.ok) {
        throw Error(`HTTP error! Status: ${response.status}`);
      }

      const responseBodya = await response.json();
      setResponseBody(responseBodya);
    } catch (error) {
      setError(error.message); // Set error message to state
    }
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
      <div>{accessToken}</div>
      <div>{responseBody[0] ? responseBody[0].session_id : 'hello'}</div>
      <div>{error ? `Error: ${error}` : 'No Errors'}</div>
      <div>{a ? { a } : 'No AErrors'}</div>
    </>
  );
};

export default TestApi;
