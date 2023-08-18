import { useEffect, useState } from 'react';
import { LineChart, Label, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

interface GroupedData {
  month: string;
  resource_consumed: number;
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
const HostDashboard = () => {
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
    const last10Rows = data.slice(-33)
    // console.log("last10Rows", last10Rows)
    // Group data by resource_consumed per month
    const groupedDataObject = data.reduce((acc, entry) => {
      const month = new Date(entry.session_start_datetime * 1000).toLocaleString('default', { month: 'long' });
      acc[month] = acc[month] || { month, resource_consumed: 0 };
      acc[month].resource_consumed += Number(entry.resource_consumed); // Ensure resource_consumed is converted to a number.
      return acc;
    }, {} as { [key: string]: GroupedData });

    // console.log("groupedDataObject", groupedDataObject)
    const groupedData: GroupedData[] = Object.values(groupedDataObject);
    // console.log("groupedData", groupedData)
    return (
      <Stack
        height="100%"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        id='dashboard-stack'

      >
        <Box sx={{ height: '7%', display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h1" style={{ fontSize: '20px', margin: '1.5rem 0 0 0' }}>
            Resource Monitoring
          </Typography>
        </Box>

        <Box sx={{ height: '40%', width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ResponsiveContainer width="85%" height="90%">
            <LineChart data={groupedData} margin={{ top: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} >
              <Label
                value="Resource Consumed per Month"
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fontSize: 16 }}
              />
              </YAxis>
              <Tooltip />
              {/* <Legend /> */}
              <Line type="monotone" dataKey="resource_consumed" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Box id='datagrid-container-outer' sx={{ height: '53%', width: "95%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Datagrid data={data} hasButton={true} expandView={false} rotateButton={false} fromClient={false}/>
        </Box>
      </Stack>
      );
  };

export default HostDashboard;

