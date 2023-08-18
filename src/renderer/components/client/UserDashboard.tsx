import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { useEffect } from 'react';
import actions from 'renderer/redux/actionCreators';
import {
  handleDeregisterClient,
  handleRegisterClient,
} from 'renderer/utils/handleRegistration';
import { useTheme } from '@emotion/react';

export default function UserDashboard() {
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const jobResults = useSelector((state: RootState) => state.jobs.jobResults);
  const theme = useTheme();
  // TODO: centralize subscriptions to ensure updating store only happens once
  useEffect(() => {
    window.electron.onSubscribeJobs((_event, id, content) => {
      actions.addJob(id.toString(), content);
    });
    window.electron.onSubscribeJobResults((_event, id, result) => {
      console.log(result);
      actions.addJobResults(id.toString(), result);
      console.log(jobResults);
    });
    window.electron.onRegisterClient(async (_event) => {
      await handleRegisterClient();
      window.electron.clientRegistered();
    });
    window.electron.onOffloadJob(async (_event, job) => {
      const id = generateUuid();
      const status = await window.electron.publishJob(id, job);
      actions.addJob(id.toString(), status);
    });
    window.electron.onDeregisterClient(async (_event) => {
      await handleDeregisterClient();
    });
    // actions.addJobResults(
    //   '01H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB16',
    //   '01H65Y01H65Y8SNN5SQG6NCE6EZ3RB168SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB16')
    // actions.addJobResults(
    //   'CE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB16',
    //   'EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB16')
    // actions.addJobResults(
    //   'CE6EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB1601H65Y8SNN5SQG6NCE66EZ3RB1601H65Y8SNN5SQG6NCE66EZ3RB1601H65Y8SNN5SQG6NCE66EZ3RB1601H65Y8SNN5SQG6NCE6EZ3RB16',
    //   'EZ3RB1601H65Y8SNN5SQG6NCE6\Users\JERYONG\Documents\mec_anywhere_desktop\src\renderETS17015: Expected corresponding closing tag for JSX fragment.Z3RB1601H65Y8SNN5SQG6NCE6EZ6EZ3RB1601H65Y8SNN5SQG6NCE66EZ3RB1601H65Y8SNN5SQG6NCE66EZ3RB1601H65Y8SNN5SQG6NCE66EZ3RB1601H65Y8SNN5SQG6NCE66EZ3RB16')
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
    <Stack sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Typography margin="4rem 0 4rem 0" variant="h1" fontSize="28px">
        Test Job Submission
      </Typography>
      <Typography
        color={theme.palette.cerulean.main}
        margin="2rem 0 2rem 0"
        variant="h1"
        fontSize="23px"
      >
        JOB RESULTS
      </Typography>
      <Grid
        container
        xs={12}
        sx={{
          height: '80%',
          width: '90%',
          justifyContent: 'center',
          alignItems: 'top',
          margin: '0 1.5rem 0rem 1.5rem',
          backgroundColor: theme.palette.mediumBlack.main,
          borderRadius: '12px',
          padding: '1rem 0.5rem 0.5rem 0.5rem',
          overflowY: 'scroll',
        }}
      >
        {!jobResults || jobResults.length == 0 ? (
          <Typography
            margin="2rem 0 2rem 0"
            textAlign="center"
            sx={{
              width: '100%',
              height: '100%',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            No jobs detected
          </Typography>
        ) : (
          <>
            <Grid
              container
              item
              xs={5}
              sx={{ margin: '1rem 1rem 0.5rem 1rem' }}
            >
              <Typography
                variant="h6" // Use an appropriate variant for your header size
                margin="0rem 0 0rem 0"
                sx={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  color: theme.palette.cerulean.main,
                }}
              >
                ID Header
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={5}
              sx={{ margin: '1rem 1rem 0.5rem 1rem' }}
            >
              <Typography
                variant="h6" // Use an appropriate variant for your header size
                margin="0rem 0 0rem 0"
                sx={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  color: theme.palette.cerulean.main,
                }}
              >
                Content Header
              </Typography>
            </Grid>

            {jobResults.map((result) => (
              <>
                <Grid
                  container
                  item
                  xs={5}
                  sx={{ margin: '0.5rem 1rem 0.5rem 1rem' }}
                >
                  <Typography
                    margin="0rem 0 0rem 0"
                    sx={{
                      width: '100%',
                      height: '100%',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {result.id}:
                  </Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={5}
                  sx={{ margin: '0.5rem 1rem 0.5rem 1rem' }}
                >
                  <Typography
                    margin="0rem 0 0rem 0"
                    sx={{
                      width: '100%',
                      height: '100%',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {result.content}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider color={theme.palette.lightPurple.main} />
                </Grid>
              </>
            ))}
          </>
        )}
      </Grid>

      <Button
        sx={{
          width: '20rem',
          backgroundColor: theme.palette.violet.main,
          margin: '2rem 0 2rem 0',
        }}
        variant="contained"
        onClick={handleClear}
      >
        Clear Job
      </Button>
    </Stack>
  );
}
