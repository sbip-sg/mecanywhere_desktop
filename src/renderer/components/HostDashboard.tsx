import { Alert, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Job, JobResult } from './utils/jobs';

function HostDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    window.electron.onSubscribeJobs((_event, id, result) => {
      const newJob = {
        id: `job ${id.toString()}`,
        content: result,
      };
      setJobs((prevJobs) => [...prevJobs, newJob]);
    });
    window.electron.onSubscribeJobResults((_event, id, result) => {
      const newJobResult = {
        id: `result ${id.toString()}`,
        content: result,
      };
      setJobs((prevJobs) => [...prevJobs, newJobResult]);
    });
  }, []);

  const clear = () => {
    setJobs([]);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginTop: '2rem',
      }}
    >
      <Typography fontSize="24px">
        Host Dashboard
        {/* <Button onClick={clear}>Clear</Button> */}
      </Typography>
      {jobs.map((result) => {
        return (
          <Alert key={result.id}>
            <Typography noWrap>{result.id}</Typography>
            {result.content}
          </Alert>
        );
      })}
      <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                marginTop: "1rem"
            }}
            >
          <Button fullWidth variant="contained" color="secondary" onClick={clear}>Clear Job</Button>
            </Box>
    </Box>
  );
}

export default HostDashboard;
