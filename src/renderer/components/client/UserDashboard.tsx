import { Alert, Box, Button, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { useEffect } from 'react';
import actions from 'renderer/redux/actionCreators';
import { handleDeregisterClient, handleRegisterClient } from 'renderer/utils/handleRegistration';

export default function UserDashboard() {
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const jobResults = useSelector((state: RootState) => state.jobs.jobResults);

  // TODO: centralize subscriptions to ensure updating store only happens once
  useEffect(() => {
    window.electron.onSubscribeJobs((_event, id, content) => {
      actions.addJob(id.toString(), content);
    });
    window.electron.onSubscribeJobResults((_event, id, result) => {
      actions.addJobResults(id.toString(), result);
    });
    window.electron.onRegisterClient( async (_event, containerRef) => {
      try {
        await handleRegisterClient(containerRef);
        window.electron.clientRegistered(true);
      } catch (error) {
        window.electron.clientRegistered(false);
      }
    });
    window.electron.onOffloadJob( async (_event, job) => {
      const id = generateUuid();
      const status = await window.electron.publishJob(id, job);
      actions.addJob(id.toString(), status);
    })
    window.electron.onDeregisterClient( async (_event) => {
      await handleDeregisterClient();
    })
  }, []);

  const generateUuid = () => {
    return (
      Math.random().toString() +
      Math.random().toString() +
      Math.random().toString()
    );
  };

  const handleClear = () => {
    actions.setJobs([]);
    actions.setJobResults([]);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          marginTop: '2rem',
        }}
      >
        <Typography fontSize="24px">User Dashboard</Typography>
      </Box>
      <Grid>
        <Typography>Job Results</Typography>
        {!jobResults || jobResults.length == 0 ? (
          <Typography>No jobs</Typography>
        )
        : jobResults.map((result) => {
          return (
            <Alert key={result.id}>
              <Typography noWrap>{result.id}</Typography>
              {result.content}
            </Alert>
          );
        })}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            marginTop: '1rem',
          }}
        >
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleClear}
          >
            Clear Job
          </Button>
        </Box>
      </Grid>
    </>
  );
};
