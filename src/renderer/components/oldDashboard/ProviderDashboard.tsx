import { useEffect, useState } from 'react';
import { LineChart, Label, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box'
import {Typography } from '@mui/material';
import { Stack } from '@mui/material';
import ProviderDatagrid from './ProviderDatagrid';
import { useTheme } from '@emotion/react'
import { convertEpochToStandardTimeWithDate } from 'renderer/utils/unitConversion';

interface DataEntry {
  session_id: string;
  did: string;
  resource_consumed: number;
  session_start_datetime: number;
  session_end_datetime: number;
  task: string;
  duration: number;
  is_host: string;
}

interface GroupedData {
  month: string;
  resource_consumed: number;
}
interface NewGroupedData {
  month: string;
  resource_consumed: number;
  isHost: boolean;
}

const ProviderDashboard = () => {
    const theme = useTheme();
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
    // const groupedDataObject = data.reduce((acc, entry) => {
    //   const month = new Date(entry.session_start_datetime * 1000).toLocaleString('default', { month: 'long' });
    //   acc[month] = acc[month] || { month, resource_consumed: 0 };
    //   acc[month].resource_consumed += Number(entry.resource_consumed); 
    //   return acc;
    // }, {} as { [key: string]: GroupedData });
    // const groupedData: GroupedData[] = Object.values(groupedDataObject);
    // console.log("groupedData", groupedData)

    // Your existing code for grouping by month
    const groupedDataObject = data.reduce((acc, entry) => {
      const month = new Date(entry.session_start_datetime * 1000).toLocaleString('default', { month: 'long' });
      acc[month] = acc[month] || { month, resource_consumed: 0 };
      acc[month].resource_consumed += Number(entry.resource_consumed); 
      return acc;
    }, {} as { [key: string]: GroupedData });
    const groupedData: GroupedData[] = Object.values(groupedDataObject);

    // Separate data based on isHost field
    const groupedDataIsHostObject = data.reduce((acc, entry) => {
      // console.log(entry)
      if (entry.is_host === "true") {
        const month = new Date(entry.session_start_datetime * 1000).toLocaleString('default', { month: 'long' });
        acc[month] = acc[month] || { month, resource_consumed: 0 };
        acc[month].resource_consumed += Number(entry.resource_consumed);
      }
      return acc;
    }, {} as { [key: string]: GroupedData });
    const groupedDataIsHost: GroupedData[] = Object.values(groupedDataIsHostObject);
    console.log("groupedDataIsHost", groupedDataIsHost)
    const groupedDataNotHostObject = data.reduce((acc, entry) => {
      if (entry.is_host  === "false") {

        const month = new Date(entry.session_start_datetime * 1000).toLocaleString('default', { month: 'long' });
        acc[month] = acc[month] || { month, resource_consumed: 0 };
        acc[month].resource_consumed += Number(entry.resource_consumed);
      }
      return acc;
    }, {} as { [key: string]: GroupedData });
    const groupedDataNotHost: GroupedData[] = Object.values(groupedDataNotHostObject);
    console.log("groupedDataNotHost", groupedDataNotHost)
// Add isHost=true to objects from groupedDataIsHost
const combinedDataArray: { resource_consumed_is_host: number; resource_consumed_not_host: number; month: string }[] = [];

// Iterate through the months in the grouped data arrays
const allMonths = new Set([...groupedDataIsHost.map(entry => entry.month), ...groupedDataNotHost.map(entry => entry.month)]);

for (const month of allMonths) {
  const resource_consumed_is_host = groupedDataIsHost.find(entry => entry.month === month)?.resource_consumed || 0;
  const resource_consumed_not_host = groupedDataNotHost.find(entry => entry.month === month)?.resource_consumed || 0;

  combinedDataArray.push({
    resource_consumed_is_host,
    resource_consumed_not_host,
    month,
  });
}


console.log("combinedData", combinedDataArray)
    return (
      <Stack
        height="100%"
        justifyContent="center"
        alignItems="center"
        spacing={0}
        id='dashboard-stack'

      >
        <Box sx={{ height: '7%', display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h1" style={{ fontSize: '20px', margin: '1.5rem 0 0 0' }}>
            Usage Overview
          </Typography>
        </Box>

        <Box sx={{ height: '40%', width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ResponsiveContainer width="85%" height="90%">
            <LineChart data={combinedDataArray} margin={{ top: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} allowDuplicatedCategory={false}/>
              <YAxis tick={{ fontSize: 12 }} >
              <Label
                value="Resource Provided/Consumed per Month"
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fontSize: 12 }}
              />
              </YAxis>
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="resource_consumed_is_host" stroke={theme.palette.violet.main}  name="Resource Provided by Hosts"/>
              <Line type="monotone" dataKey="resource_consumed_not_host" stroke={theme.palette.mintGreen.main} name="Resource Consumed by Clients"/>
            </LineChart>
          </ResponsiveContainer>          
        </Box>
        <Box id='datagrid-container-outer' sx={{ height: '53%', width: "95%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <ProviderDatagrid data={dateConvertedData} hasButton={true} expandView={false} rotateButton={false} fromClient={true}/>
        </Box>
      </Stack>
      );
  };
  
export default ProviderDashboard;

