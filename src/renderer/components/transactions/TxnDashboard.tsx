import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { Typography, Stack, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import reduxStore from 'renderer/redux/store';
import RefreshIcon from '@mui/icons-material/Refresh';
import { scrollbarHeight } from 'renderer/utils/constants';
import CustomLineChart from './linechart/CustomLineChart';
import { ExternalDataEntry, InternalDataEntry } from '../common/dataTypes';
import { ExternalPropConfigList, InternalPropConfigList } from './propConfig';
import Datagrid from './table/Datagrid';
import {
  addDummyHistory,
  findHostHistory,
  findPoHistory,
} from '../../services/TransactionServices';
import Transitions from '../transitions/Transition';
import {
  tablePaginationMinHeight,
  maxRowHeight,
  toolbarMinHeight,
  unexpandedRowPerPage,
} from './table/TableParams';

interface TxnDashboardProps {
  appRole: string;
}

const TxnDashboard: React.FC<TxnDashboardProps> = ({ appRole }) => {
  const did = window.electron.store.get('did');
  const [data, setData] = useState<ExternalDataEntry[]>([]);
  const [hasData, setHasData] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const maxTableHeight = maxRowHeight * (unexpandedRowPerPage + 1) - 1;
  const chartHeightOffset = `${
    tablePaginationMinHeight +
    maxTableHeight +
    toolbarMinHeight +
    scrollbarHeight -
    1
  }px`;

  const fetchAndSetData = async (accessToken: string, role: string) => {
    setIsLoading(true);
    try {
      const didHistoryResponse = await (role === 'provider'
        ? findPoHistory(accessToken, did)
        : findHostHistory(accessToken, did));
      if (didHistoryResponse) {
        const responseBody = await didHistoryResponse.json();
        if (responseBody.length > 0) {
          setHasData(true);
        }
        setData(responseBody);
      } else {
        console.error('No response from didHistory');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    const { accessToken } = reduxStore.getState().userReducer;
    if (accessToken) {
      await fetchAndSetData(accessToken, appRole);
    } else {
      console.error('Invalid access token or did');
    }
  };

  const handleAddHostDummyData = async () => {
    const { accessToken } = reduxStore.getState().userReducer;
    if (accessToken) {
      const addDummyHistoryResponse = await addDummyHistory(accessToken, {
        host_did: did,
      });
      if (!addDummyHistoryResponse) {
        console.error('Invalid dummy history response');
        return;
      }
      await fetchAndSetData(accessToken, appRole);
    } else {
      console.error('Invalid access token or did');
    }
  };

  const handleAddProviderDummyData = async () => {
    const { accessToken } = reduxStore.getState().userReducer;
    if (accessToken) {
      const hostPoResponse = await addDummyHistory(accessToken, {
        host_po_did: did,
      });
      const clientPoResponse = await addDummyHistory(accessToken, {
        client_po_did: did,
      });
      if (!hostPoResponse || !clientPoResponse) {
        console.error('Invalid dummy history response');
        return;
      }
      await fetchAndSetData(accessToken, appRole);
    } else {
      console.error('Invalid access token or did');
    }
  };

  const handleAddDummyData = async (role: string) => {
    return role === 'provider'
      ? handleAddProviderDummyData()
      : handleAddHostDummyData();
  };

  useEffect(() => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const retrieveData = async () => {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (credential) {
        const { accessToken } = reduxStore.getState().userReducer;
        await fetchAndSetData(accessToken, appRole);
      } else {
        console.error('Credential or DID is missing');
      }
    };
    retrieveData();
  }, []);

  return isLoading ? (
    <CircularProgress
      style={{
        color: 'secondary.main',
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon
                  fontSize="small"
                  sx={{ color: 'text.primary', marginRight: '0.5rem' }}
                />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '14px',
                  letterSpacing: '0.0em',
                  margin: '0 0 0 0',
                  whiteSpace: 'nowrap',
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                {appRole === 'host' &&
                  'You have not shared any resources for the past 6 months.'}
                {appRole === 'provider' &&
                  'Your users have not shared any resources for the past 6 months.'}
              </Typography>
            </Box>
            <Button
              onClick={() => handleAddDummyData(appRole)}
              sx={{
                margin: '2rem 0 0 0',
                padding: '0.5rem 1.5rem',
                backgroundColor: 'primary.main',
              }}
            >
              Add Dummy Data (development)
            </Button>
          </Box>
        )}
        {hasData && (
          <motion.div
            id="line-chart-motion-div"
            style={{
              height: isTableExpanded
                ? '0%'
                : `calc(90% - ${chartHeightOffset})`,
              width: '90%',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
            }}
            initial={{ height: `calc(90% - ${chartHeightOffset})` }}
            animate={{
              height: isTableExpanded
                ? '0%'
                : `calc(90% - ${chartHeightOffset})`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <CustomLineChart
              data={data}
              handleRefresh={handleRefresh}
              handleAddDummyData={handleAddDummyData}
              appRole={appRole}
            />
          </motion.div>
        )}
        {hasData && (
          <motion.div
            id="table-motion-div"
            style={{
              height: isTableExpanded ? '90%' : chartHeightOffset,
              width: '90%',
            }}
            initial={{ height: chartHeightOffset }}
            animate={{ height: isTableExpanded ? '90%' : chartHeightOffset }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Datagrid
              data={data}
              isTableExpanded={isTableExpanded}
              setIsTableExpanded={setIsTableExpanded}
              propConfigList={
                appRole === 'provider'
                  ? InternalPropConfigList
                  : ExternalPropConfigList
              }
            />
          </motion.div>
        )}
      </Stack>
    </Transitions>
  );
};

export default TxnDashboard;
