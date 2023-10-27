import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { Typography, Stack, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@emotion/react';
import CircularProgress from '@mui/material/CircularProgress';
import reduxStore from 'renderer/redux/store';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomLineChart from './linechart/CustomLineChart';
import actions from '../../redux/actionCreators';
import { ExternalDataEntry } from '../../utils/dataTypes';
import { ExternalPropConfigList } from './propConfig';
import { registerHost } from '../../services/RegistrationServices';
import Datagrid from './table/Datagrid';
import {
  addDummyHistory,
  findDidHistory,
} from '../../services/TransactionServices';
import Transitions from '../transitions/Transition';

interface TxnDashboardProps {
  appRole: string;
}

const TxnDashboard: React.FC<TxnDashboardProps> = ({ appRole }) => {
  const theme = useTheme();
  const [data, setData] = useState<ExternalDataEntry[]>([]);
  const [hasData, setHasData] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const preprocessData = (preData: any): ExternalDataEntry[] => {
    console.log("preData", preData)
    const processedData = preData;
    return processedData;
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    const { accessToken } = reduxStore.getState().userReducer;
    console.log('accessToken', accessToken);
    const did = window.electron.store.get('did');
    console.log('did', did);

    // const did = 'did:meca:0x52c328ef8b382b1d71cc262b868d803a137ab8d8'
    if (accessToken && did) {
      const didHistoryResponse = await findDidHistory(accessToken, did);
      if (didHistoryResponse) {
        const responseBody = await didHistoryResponse.json();
        console.log('responseBody', responseBody);
        if (responseBody.length > 0) {
          setHasData(true);
        }
        const processedData = preprocessData(responseBody)
        setData(processedData);
        setIsLoading(false);
      }
    } else {
      console.error('Invalid access token or did');
    }
  };

  const handleAddMockData = async () => {
    setIsLoading(true);
    const { accessToken } = reduxStore.getState().userReducer;
    const did = window.electron.store.get('did');
    if (accessToken && did) {
      const addDummyHistoryResponse = await addDummyHistory(accessToken, did);
      if (!addDummyHistoryResponse) {
        console.error('Invalid dummy history response');
      }
      const didHistoryResponse = await findDidHistory(accessToken, did);
      if (didHistoryResponse) {
        const responseBody = await didHistoryResponse.json();
        if (responseBody.length > 0) {
          setHasData(true);
        }
        // setData(responseBody);
        const processedData = preprocessData(responseBody)
        setData(processedData);
        setIsLoading(false);
      }
    } else {
      console.error('Invalid access token or did');
    }
  };

  useEffect(() => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const did = window.electron.store.get('did');
    console.log('credential', window.electron.store.get('credential'));
    console.log('did', did);
    const getAccessToken = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (credential && did) {
        try {
          const accessTokenResponse = await registerHost(did, credential);
          const { access_token } = accessTokenResponse;
          console.log('accessToken', access_token);

          actions.setAccessToken(access_token);
          const didHistoryResponse = await findDidHistory(access_token, did);
          if (didHistoryResponse) {
            const responseBody = await didHistoryResponse.json();
            if (responseBody.length > 0) {
              setHasData(true);
            }
            setData(responseBody);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error during registerHost:', error);
        }
      }
    };
    getAccessToken();
  }, []);

  return isLoading ? (
    <CircularProgress
      style={{
        color: theme.palette.mintGreen.main,
        position: 'absolute',
        width: '4rem',
        height: '4rem',
        left: '50%',
        top: '50%',
        translate: '-2rem -2rem',
      }}
    />
  ) : (
    <Transitions duration={1}>
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
        {!hasData && (
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
            <Box sx={{ display: 'flex' }}>
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon fontSize="small" sx={{ color: 'white' }} />
              </IconButton>
              <Typography
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.0em',
                  margin: '0 0 0 0',
                  whiteSpace: 'nowrap',
                  color: theme.palette.cerulean.main,
                }}
              >
                {appRole === 'host' &&
                  'You have not shared any resources for the past 6 months.'}
                {appRole === 'provider' &&
                  'Your users have not shared any resources for the past 6 months.'}
              </Typography>
            </Box>
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
        {hasData && (
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
              handleRefresh={handleRefresh}
            />
          </motion.div>
        )}
        {hasData && (
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
    </Transitions>
  );
};

export default TxnDashboard;
