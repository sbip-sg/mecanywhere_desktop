import { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import {Typography } from '@mui/material';
import { Stack } from '@mui/material';
import Datagrid from './Datagrid';

interface DataEntry {
  session_id: string;
  did: string;
  resource_consumed: number;
  session_start_datetime: number;
  session_end_datetime: number;
  task: string;
  duration: number;
}

function convertEpochToStandardTimeWithDate(epochTimeInSeconds) {
  const dateObj = new Date(epochTimeInSeconds * 1000);
  const year = dateObj.getUTCFullYear().toString().slice(-2);
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getUTCDate().toString().padStart(2, '0');
  const hours = dateObj.getUTCHours().toString().padStart(2, '0');
  const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const HostDashboardNoChart = () => {
    const [data, setData] = useState<DataEntry[]>([]);
    useEffect(() => {
      const csvFilePath = 'http://localhost:3000/data'; // Replace with the correct endpoint URL where your server is serving the CSV data.
      fetch(csvFilePath)
        .then((response) => response.json()) // Assuming your server sends JSON data instead of raw text.
        .then((responseData) => {
            // console.log("responseData", responseData)
            const convertedData = responseData.map(entry => ({
              ...entry,
              session_start_datetime: convertEpochToStandardTimeWithDate(entry.session_start_datetime),
              session_end_datetime: convertEpochToStandardTimeWithDate(entry.session_end_datetime),
            }));

            const middleIndex = Math.ceil(convertedData.length / 2);
            const firstHalf = convertedData.slice(0, middleIndex);
            const secondHalf = convertedData.slice(middleIndex);

            // Swap the two halves and update the state
            setData([...secondHalf, ...firstHalf]);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

    return (
      <Stack
        id='dashboard-stack'
        height="100%"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {/* <Box sx={{ height: '10%', display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h1" style={{ fontSize: '20px', margin: '1.5rem 0 0 0' }}>
            Past Transactions
          </Typography>
        </Box> */}
        <Box id='boxy' sx={{ height: '100%', width: "95%", display: "flex", justifyContent: "center", alignItems: "center", overflowY: 'hidden' }}>
          <Datagrid data={data} hasButton={false} expandView={true} rotateButton={true} fromClient={false}/>
        </Box>
      </Stack>
      );
  };

export default HostDashboardNoChart;
