import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Typography, Stack } from '@mui/material';
import { convertEpochToStandardTimeWithDate } from 'renderer/utils/unitConversion';
import { motion } from 'framer-motion';
import Datagrid from './table/Datagrid';
import { ExternalDataEntry } from './table/dataTypes';
import CustomLineChart from './linechart/CustomLineChart';
import { ExternalPropConfigList } from './propConfig';

interface GroupedData {
  month: string;
  resource_consumed: number;
}

const TestPage = () => {
  const [data, setData] = useState<ExternalDataEntry[]>([]);
  const [dateConvertedData, setDateConvertedData] = useState<
    ExternalDataEntry[]
  >([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  useEffect(() => {
    const csvFilePath = 'http://localhost:3000/data';
    fetch(csvFilePath)
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
        const convertedData = responseData.map((entry) => ({
          ...entry,
          session_start_datetime: convertEpochToStandardTimeWithDate(
            entry.session_start_datetime
          ),
          session_end_datetime: convertEpochToStandardTimeWithDate(
            entry.session_end_datetime
          ),
        }));
        setDateConvertedData(convertedData);
      });
  }, []);
  const groupedDataObject = data.reduce((acc, entry) => {
    const month = new Date(entry.session_start_datetime * 1000).toLocaleString(
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
      justifyContent="center"
      alignItems="center"
      spacing={0}
      id="dashboard-stack"
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
        style={{
          height: isTableExpanded ? '0%' : '45%',
          width: '100%',
        }}
        initial={{ height: '45%' }}
        animate={{ height: isTableExpanded ? '0%' : '45%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <CustomLineChart groupedData={groupedData} />
      </motion.div>
      <motion.div
        style={{
          height: isTableExpanded ? '90%' : '45%',
          width: '100%',
        }}
        initial={{ height: '45%' }}
        animate={{ height: isTableExpanded ? '90%' : '45%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Datagrid
          data={dateConvertedData}
          isTableExpanded={isTableExpanded}
          setIsTableExpanded={setIsTableExpanded}
          propConfigList={ExternalPropConfigList}
        />
      </motion.div>
    </Stack>
  );
};

export default TestPage;
