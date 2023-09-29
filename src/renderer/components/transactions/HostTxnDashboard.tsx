import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Datagrid from './table/Datagrid';
import { ExternalDataEntry } from '../common/dataTypes';
import CustomLineChart from './linechart/CustomLineChart';
import { ExternalPropConfigList } from './propConfig';
// import mockUserData from '../../../../assets/mockUserData.json';
import { registerHost } from '../../services/RegistrationServices';
import actions from '../../redux/actionCreators';
import { findDidHistory } from '../../services/TransactionServices';
// const log = require('electron-log');
// import log from 'electron-log/main';
import log from 'electron-log/renderer';
log.info('Log from the renderer process1');

const HostTxnDashboard = () => {
  const [data, setData] = useState<ExternalDataEntry[]>([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  log.info('Hello, log');

  useEffect(() => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const did = window.electron.store.get('did');
    log.info('credential', credential);
    log.info('did', did);
    const getAccessToken = async () => {
      if (credential && did) {
        actions.setCredential(credential);
        try {
          const accessTokenResponse = await registerHost(did, credential);
          const { access_token } = accessTokenResponse;
          log.info('access_token', access_token);
          actions.setHostAccessToken(access_token);
          const didHistoryResponse = await findDidHistory(access_token, did);
          log.info('didHistoryResponse', didHistoryResponse);

          if (didHistoryResponse) {
            const responseBody = await didHistoryResponse.json();
            console.log('response body', responseBody);
            setData(responseBody);
            log.info('responseBody', responseBody);
          }
        } catch (error) {
          console.error('Error during registerHost:', error);
          log.info('error', error);

          // Handle error appropriately
        }
      }
    };

    getAccessToken();
    // setData(mockUserData);
  }, []);

  useEffect(() => {
    console.log('data', data);
    // log.info('data', data);
  }, [data]);

  return (
    <Stack
      id="dashboard-wrapper-stack"
      height="100%"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
      sx={{ padding: '2rem 0 2rem 0' }}
    >
      <Box
        id="title-wrapper"
        sx={{
          height: '10%',
          width: '90%',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'end',
          padding: '0 0 0 2%',
        }}
      >
        <Typography
          style={{
            fontSize: '24px',
            letterSpacing: '0.1em',
            margin: '0 0 0 0',
            whiteSpace: 'nowrap',
          }}
        >
          Resource Utilization Overview
        </Typography>
      </Box>
      <motion.div
        id="line-chart-motion-div"
        style={{
          height: isTableExpanded ? '0%' : 'calc(90% - 282px)',
          width: '90%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
        initial={{ height: 'calc(90% - 282px)' }}
        animate={{ height: isTableExpanded ? '0%' : 'calc(90% - 282px)' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <CustomLineChart data={data} yAxisLabel="Resource Utilized per Month" />
      </motion.div>
      <motion.div
        id="table-motion-div"
        style={{
          height: isTableExpanded ? '90%' : '282px',
          width: '90%',
        }}
        initial={{ height: '282px' }}
        animate={{ height: isTableExpanded ? '90%' : '282px' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Datagrid
          data={data}
          isTableExpanded={isTableExpanded}
          setIsTableExpanded={setIsTableExpanded}
          propConfigList={ExternalPropConfigList}
        />
      </motion.div>
    </Stack>
  );
};

export default HostTxnDashboard;
