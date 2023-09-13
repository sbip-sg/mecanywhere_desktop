import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Datagrid from './table/Datagrid';
import { ExternalDataEntry } from './table/dataTypes';
import CustomLineChart from './linechart/CustomLineChart';
import { ExternalPropConfigList } from './propConfig';
import mockUserData from '../../../../assets/mockUserData.json';

const HostTxnDashboard = () => {
  const [data, setData] = useState<ExternalDataEntry[]>([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  useEffect(() => {
    setData(mockUserData);
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