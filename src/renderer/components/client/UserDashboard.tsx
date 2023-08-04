import { Alert, Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { useEffect } from 'react';
import { useTheme } from '@emotion/react';
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
      console.log(result);
      actions.addJobResults(id.toString(), result);
      console.log(jobResults)
    });
    window.electron.onRegisterClient( async (_event) => {
      await handleRegisterClient();
      window.electron.clientRegistered();
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
  const theme = useTheme();

  return (
    <Stack sx={{display: 'flex', alignItems: 'center'}}>
      <Typography 
        margin="4rem 0 4rem 0"
        variant="h1" 
        fontSize="28px">
          Test Job Submission
      </Typography>
      <Typography 
        color={theme.palette.cerulean.main}
        margin="2rem 0 2rem 0" 
        variant="h1"
        fontSize="23px">
          JOB RESULTS
      </Typography>
      <Box sx={{
        width: "80%",
        height: "80%",
        backgroundColor: theme.palette.mediumBlack.main,
        padding: "2rem 2rem 2rem 2rem",
        borderRadius: '10px',
        display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>


      {!jobResults || jobResults.length == 0 ? (
        <Typography margin="2rem 0 2rem 0" textAlign='center'
          sx={{ 
            width: "100%", 
            height: "100%",
            wordWrap: "break-word",
            overflowWrap: "break-word" 
          }}>
            No jobs detected
        {/* TEST LONGS MESSAGE ascascascascROR in C:\Users\JERYONG\Documents\mec_anywhere_desktop\src\renderer\components\client\UserDashboard.tsx
./src/renderer/components/client/UserDashboard.tsx 81:121-122 ERROR in C:\Users\JERYONG\Documents\mec_anywhere_desktop\src\renderer\components\client\UserDashboard.tsx(81,122)
      TS1381: Unexpected token. Did you mean ?    
 @ ./src/renderer/App.tsx 26:0-62 36:2025-2038
 @ ./src/renderer/index.tsx 4:0-24 15
        ascscscscscscscscscscscscscscscscscscscscscscscscscscscscscscscsc */}
        </Typography>
        )
        : jobResults.map((result) => {
          return (
            <Alert key={result.id}>
             <Typography margin="2rem 0 2rem 0" 
              sx={{ 
                width: "100%", 
                height: "100%",
                wordWrap: "break-word",
                overflowWrap: "break-word" 
              }}>
            {result.id}
            {result.content}
              </Typography>
          </Alert>
        );})}
        </Box>
             
        <Button
          sx={{
            width: '20rem',
            backgroundColor: theme.palette.violet.main,
            margin: "2rem 0 2rem 0"
          }}
          variant="contained"
          onClick={handleClear}
          >
          Clear Job
        </Button>
      </Stack>
  );
};
