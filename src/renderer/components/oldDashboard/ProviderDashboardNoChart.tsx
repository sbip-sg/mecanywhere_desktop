import { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import {Typography } from '@mui/material';
import { Stack } from '@mui/material';
import Datagrid from './Datagrid';
import ProviderDatagrid from './ProviderDatagrid';
import { convertEpochToStandardTimeWithDate } from 'renderer/utils/unitConversion';

interface DataEntry {
  session_id: string;
  did: string;
  resource_consumed: number;
  session_start_datetime: number;
  session_end_datetime: number;
  task: string;
  duration: number;
}

const ProviderDashboardNoChart = () => {
    const [data, setData] = useState<DataEntry[]>([]);
    const [dateConvertedData, setDateConvertedData] = useState<DataEntry[]>([]);

    useEffect(() => {
      const csvFilePath = 'http://localhost:3000/providerdata'; 
      fetch(csvFilePath)
        .then((response) => response.json()) 
        .then((responseData) => {
          console.log("responseData", responseData[0])
          setData(responseData);
          const convertedData = responseData.map(entry => ({
            ...entry,
            session_start_datetime: convertEpochToStandardTimeWithDate(entry.session_start_datetime),
            session_end_datetime: convertEpochToStandardTimeWithDate(entry.session_end_datetime),
          }));
          setDateConvertedData(convertedData)
        });
    }, []);

    return (
      <Stack
        id='dashboard-stack'
        height="100%"
        justifyContent="center"
        alignItems="center"
        // marginTop="5rem"
        spacing={2}
      >
        {/* <Box sx={{ height: '10%', display: "flex", justifyContent: "center", alignItems: "center" }}>
        </Box> */}
        <Box id='boxy' sx={{ height: '100%', width: "95%", display: "flex", justifyContent: "center", alignItems: "center", overflowY: 'hidden' }}>
          <ProviderDatagrid data={dateConvertedData} hasButton={false} expandView={true} rotateButton={true} fromClient={true}/>
        </Box>
      </Stack>
      );
  };
  
export default ProviderDashboardNoChart;
