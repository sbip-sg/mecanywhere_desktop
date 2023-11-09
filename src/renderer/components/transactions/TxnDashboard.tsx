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
import { ExternalDataEntry, InternalDataEntry } from '../../utils/dataTypes';
import { ExternalPropConfigList } from './propConfig';
import { authenticate } from '../../services/RegistrationServices';
import Datagrid from './table/Datagrid';
import {
  addHostDummyHistory,
  findHostHistory,
} from '../../services/TransactionServices';
import Transitions from '../transitions/Transition';

interface TxnDashboardProps {
  appRole: string;
}

function getRandomCpu(): number {
  return Math.floor(Math.random() * 4) + 1;
}

function getRandomMemory(): number {
  const min = 1024 / 256;
  const max = 8192 / 256;
  const randomMultiple = Math.floor(Math.random() * (max - min + 1) + min);
  return randomMultiple * 256;
}

const generateRandomDID = () => {
  const randomHex = (Math.random() * Math.pow(2, 64))
    .toString(16)
    .padStart(40, '0');
  return 'did:meca:0x' + randomHex;
};

const generateProviderDID = (ownDid: string) => {
  const providerDidArray = [
    ownDid,
    'did:meca:0xada873405e83c30a208ae3e50ee06c60569e8a18',
    'did:meca:0x40f219cf9170792562e22b297c73b5dff8177995',
  ];
  const randomIndex = Math.floor(Math.random() * providerDidArray.length);
  return providerDidArray[randomIndex];
};

const TxnDashboard: React.FC<TxnDashboardProps> = ({ appRole }) => {
  const theme = useTheme();
  const [data, setData] = useState<ExternalDataEntry[]>([]);
  const [hasData, setHasData] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const preprocessDataForProvider = (
    preprocessedData: ExternalDataEntry[]
  ): InternalDataEntry[] => {
    const ownDid = window.electron.store.get('did');
    const processedData = preprocessedData.map((entry) => {
      const hostPoDid = generateProviderDID(ownDid);
      let clientPoDid;
      let is_host;
      let is_client;
      if (hostPoDid === ownDid) {
        is_host = true;
        clientPoDid = generateProviderDID(ownDid);
        if (clientPoDid === ownDid) {
          is_client = true;
        }
      } else {
        clientPoDid = ownDid;
        is_client = true;
      }
      return {
        ...entry,
        resource_cpu: getRandomCpu(),
        resource_memory: getRandomMemory(),
        host_did: generateRandomDID(),
        client_did: generateRandomDID(),
        host_po_did: hostPoDid,
        client_po_did: clientPoDid,
        is_client,
        is_host,
      };
    });
    return processedData;
  };

  const preprocessDataForUser = (
    preprocessedData: ExternalDataEntry[]
  ): ExternalDataEntry[] => {
    const executorSettings = JSON.parse(
      window.electron.store.get('executorSettings')
    )
    console.log("executorSettings", executorSettings)
    const processedData = preprocessedData.map((entry) => {
      return {
        ...entry,
        resource_cpu: executorSettings.cpu_cores,
        resource_memory: executorSettings.memory_mb,
      };
    });
    return processedData;
  };

  const preprocessData = (
    preprocessedData: ExternalDataEntry[] | InternalDataEntry[]
  ) => {
    let processedData;
    console.log('preprocessedData, ', preprocessedData);
    if (appRole === 'provider') {
      processedData = preprocessDataForProvider(preprocessedData);
    } else {
      processedData = preprocessDataForUser(preprocessedData);
    }
    console.log('processedData, ', processedData);
    return processedData;
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    const { accessToken } = reduxStore.getState().userReducer;
    const did = window.electron.store.get('did');
    if (accessToken && did) {
      const didHistoryResponse = await findHostHistory(accessToken, did);
      if (didHistoryResponse) {
        const responseBody = await didHistoryResponse.json();
        if (responseBody.length > 0) {
          setHasData(true);
        }
        console.log("responsebody", responseBody)
        const processedData = preprocessData(responseBody);
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
      const addDummyHistoryResponse = await addHostDummyHistory(accessToken, did);
      if (!addDummyHistoryResponse) {
        console.error('Invalid dummy history response');
      }
      // const didHistoryResponse = await findDidHistory(accessToken, did);
      const didHistoryResponse = await findHostHistory(accessToken, did);
      if (didHistoryResponse) {
        const responseBody = await didHistoryResponse.json();
        if (responseBody.length > 0) {
          setHasData(true);
        }
        const processedData = preprocessData(responseBody);
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
    const getAccessToken = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (credential && did) {
        try {
          const { accessToken } = reduxStore.getState().userReducer;
          const didHistoryResponse = await findHostHistory(accessToken, did);
          if (didHistoryResponse) {
            const responseBody = await didHistoryResponse.json();
            if (responseBody.length > 0) {
              setHasData(true);
            }
            const processedData = preprocessData(responseBody);
            setData(processedData);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error during registerClient:', error);
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
            alignItems: 'center',
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
              appRole={appRole}
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
