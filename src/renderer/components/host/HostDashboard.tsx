import { Alert, Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import actions from 'renderer/redux/actionCreators';

function HostDashboard() {
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const jobResults = useSelector((state: RootState) => state.jobs.jobResults);

  const clear = () => {
    actions.setJobs([]);
    actions.setJobResults([]);
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
      {!jobs || jobs.length == 0 ? (
          <Typography>No jobs</Typography>
        )
        : jobs.map((result) => {
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
        <Button fullWidth variant="contained" color="secondary" onClick={clear}>
          Clear Job
        </Button>
      </Box>
    </Box>
  );
}

export default HostDashboard;
