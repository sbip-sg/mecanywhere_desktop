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
import { DataEntry } from '../../utils/dataTypes';
import { PropConfigList } from './propConfig';
import Datagrid from './datagrid/Datagrid';
import { addDummyHistory } from '../../services/TransactionServices';
import Transitions from '../../utils/Transition';
import fetchTransactionHistory from '../componentsCommon/fetchTransactionHistory';
import {
  tablePaginationMinHeight,
  maxRowHeight,
  toolbarMinHeight,
  unexpandedRowPerPage,
} from './datagrid/datagridUtils/TableParams';

const TxnDashboard: React.FC = () => {
  const did = window.electron.store.get('did');
  const [data, setData] = useState<DataEntry[]>([]);
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

  const fetchAndSetData = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const transactionHistory = await fetchTransactionHistory(
        accessToken,
        did
      );
      if (transactionHistory.length > 0) {
        setHasData(true);
      }
      setData(transactionHistory);
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    const { accessToken } = reduxStore.getState().userReducer;
    if (accessToken) {
      await fetchAndSetData(accessToken);
    } else {
      console.error('Invalid access token or did');
    }
  };

  const handleAddDummyData = async () => {
    const { accessToken } = reduxStore.getState().userReducer;
    if (accessToken) {
      const addDummyClientResponse = await addDummyHistory(accessToken, {
        client_did: did,
      });
      if (!addDummyClientResponse) {
        console.error('Invalid dummy history response');
        return;
      }
      const addDummyHostResponse = await addDummyHistory(accessToken, {
        host_did: did,
      });
      if (!addDummyHostResponse) {
        console.error('Invalid dummy history response');
        return;
      }
      await fetchAndSetData(accessToken);
    } else {
      console.error('Invalid access token or did');
    }
  };

  useEffect(() => {
    const credential = JSON.parse(window.electron.store.get('credential'));
    const retrieveData = async () => {
      if (credential) {
        const { accessToken } = reduxStore.getState().userReducer;
        await fetchAndSetData(accessToken);
      } else {
        console.error('Credential or DID is missing');
      }
    };
    retrieveData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                You have not done any MECA transactions for the past 6 months.
              </Typography>
            </Box>
            <Button
              onClick={() => handleAddDummyData()}
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
              propConfigList={PropConfigList}
            />
          </motion.div>
        )}
      </Stack>
    </Transitions>
  );
};

export default TxnDashboard;
