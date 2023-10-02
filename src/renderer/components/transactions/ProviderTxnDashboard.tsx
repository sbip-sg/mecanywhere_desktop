import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Datagrid from './table/Datagrid';
import { InternalDataEntry } from '../../utils/dataTypes';
import CustomLineChart from './linechart/CustomLineChart';
import { InternalPropConfigList } from './propConfig';
import mockProviderData from '../../../../assets/mockProviderData.json';

const ProviderTxnDashboard = () => {
  const [data, setData] = useState<InternalDataEntry[]>([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  useEffect(() => {
    setData(mockProviderData);
  }, []);

  return (
    <Stack
      height="100%"
      // width="90"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
      id="dashboard-stack"
      padding="2rem 0 2rem 0"
    >
      <Box
        sx={{
          height: '10%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h1"
          style={{ fontSize: '20px', margin: '1.5rem 0 0 0' }}
        >
          User's Usage Overview
        </Typography>
      </Box>
      <motion.div
        id="motiondiv1"
        style={{
          height: isTableExpanded ? '0%' : '45%',
          width: '90%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
        initial={{ height: '45%' }}
        animate={{ height: isTableExpanded ? '0%' : '45%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <CustomLineChart data={data} yAxisLabel='Resource Utilization Per Month'/>
      </motion.div>
      <motion.div
        id="motiondiv2"
        style={{
          height: isTableExpanded ? '90%' : '282px',
          width: '90%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
        initial={{ height: '282px' }}
        animate={{ height: isTableExpanded ? '90%' : '282px' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Datagrid
          data={data}
          isTableExpanded={isTableExpanded}
          setIsTableExpanded={setIsTableExpanded}
          propConfigList={InternalPropConfigList}
        />
      </motion.div>
    </Stack>
  );
};

export default ProviderTxnDashboard;
