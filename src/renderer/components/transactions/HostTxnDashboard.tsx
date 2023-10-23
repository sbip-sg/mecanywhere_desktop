import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@emotion/react';
import reduxStore from 'renderer/redux/store';
import Datagrid from './table/Datagrid';
import CustomLineChart from './linechart/CustomLineChart';
import actions from '../../redux/actionCreators';
import { ExternalDataEntry } from '../../utils/dataTypes';
import { ExternalPropConfigList } from './propConfig';
import { registerHost } from '../../services/RegistrationServices';
import {
  addDummyHistory,
  findDidHistory,
} from '../../services/TransactionServices';

const HostTxnDashboard = () => {
  const theme = useTheme();
  const [data, setData] = useState<ExternalDataEntry[]>([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  const handleAddMockData = async () => {
    const { accessToken } = reduxStore.getState().userReducer;
    const did = window.electron.store.get('did');
    if (accessToken && did) {
      const addDummyHistoryResponse = await addDummyHistory(accessToken, did);
      if (!addDummyHistoryResponse) {
        console.error('Invalid dummy history response');
      }
    } else {
      console.error('Invalid accesstoken or did');
    }
  };

  useEffect(() => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const did = window.electron.store.get('did');
    const getAccessToken = async () => {
      if (credential && did) {
        try {
          const accessTokenResponse = await registerHost(did, credential);
          const { access_token } = accessTokenResponse;
          actions.setAccessToken(access_token);
          const didHistoryResponse = await findDidHistory(access_token, did);
          if (didHistoryResponse) {
            const responseBody = await didHistoryResponse.json();
            setData(responseBody);
          }
        } catch (error) {
          console.error('Error during registerHost:', error);
        }
      }
    };
    getAccessToken();
    // setData([]);
  }, []);

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
      {data.length === 0 && (
        <Box
          sx={{
            height: '100%',
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            padding: '3% 0 0 2.5%',
          }}
        >
          <Typography
            style={{
              fontSize: '14px',
              letterSpacing: '0.0em',
              margin: '0 0 0 0',
              whiteSpace: 'nowrap',
              color: theme.palette.cerulean.main,
            }}
          >
            You have shared any resources for the past 6 months.
          </Typography>
          <Button
            onClick={handleAddMockData}
            sx={{
              margin: '2rem 0 0 0',
            }}
          >
            Add Mock Data (development)
          </Button>
        </Box>
      )}
      {data.length > 0 && (
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
          <CustomLineChart
            data={data}
            yAxisLabel="Resource Utilized per Month"
          />
        </motion.div>
      )}
      {data.length > 0 && (
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
      )}
    </Stack>
  );
};

export default HostTxnDashboard;
