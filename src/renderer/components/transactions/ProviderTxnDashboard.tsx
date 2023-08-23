import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack } from '@mui/material';
import { convertEpochToStandardTimeWithDate } from 'renderer/utils/unitConversion';
import { motion } from 'framer-motion';
import Datagrid from './table/Datagrid';
import { InternalDataEntry } from './table/dataTypes';
import CustomLineChart from './linechart/CustomLineChart';
import { InternalPropConfigList } from './propConfig';
import mockProviderData from '../../../../assets/mockProviderData.json';

interface GroupedData {
  month: string;
  resource_consumed: number;
}

const ProviderTxnDashboard = () => {
  const [data, setData] = useState<InternalDataEntry[]>([]);
  const [dateConvertedData, setDateConvertedData] = useState<
    InternalDataEntry[]
  >([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  useEffect(() => {
    // console.log(mockProviderData);
    setData(mockProviderData);
    const convertedData = mockProviderData.map((entry) => ({
      ...entry,
      session_start_datetime: convertEpochToStandardTimeWithDate(
        entry.session_start_datetime
      ),
      session_end_datetime: convertEpochToStandardTimeWithDate(
        entry.session_end_datetime
      ),
    }));
    setDateConvertedData(convertedData);
  }, []);
  const groupedDataObject = data.reduce((acc, entry) => {
    const sessionStartDatetime =
      typeof entry.session_start_datetime === 'string'
        ? parseInt(entry.session_start_datetime)
        : entry.session_start_datetime;
    const month = new Date(sessionStartDatetime * 1000).toLocaleString(
      'default',
      { month: 'long' }
    );
    acc[month] = acc[month] || { month, resource_consumed: 0 };
    acc[month].resource_consumed += Number(entry.resource_consumed);
    return acc;
  }, {} as { [key: string]: GroupedData });

  const groupedData: GroupedData[] = Object.values(groupedDataObject);

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
          Usage Overview
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
        <CustomLineChart groupedData={groupedData} />
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
          data={dateConvertedData}
          isTableExpanded={isTableExpanded}
          setIsTableExpanded={setIsTableExpanded}
          propConfigList={InternalPropConfigList}
        />
      </motion.div>
    </Stack>
  );
};

export default ProviderTxnDashboard;
