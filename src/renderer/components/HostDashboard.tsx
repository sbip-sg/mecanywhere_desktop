import { Alert, Box, Typography } from '@mui/material';
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
      <Typography fontSize="24px">Host Dashboard</Typography>
      {jobs.map((result) => {
        return (
          <Alert key={result.id}>{`${result.id} : ${result.content}`}</Alert>
        );
      })}
    </Box>
  );
}

export default HostDashboard;
