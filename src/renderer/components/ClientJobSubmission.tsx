import {
  Typography,
  Grid,
  Button,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { JobResult } from './utils/jobs';

export default function ClientJobSubmission() {
  const [jobContent, setJobContent] = useState('');
  const [jobResults, setJobResults] = useState<JobResult[]>([]);

  useEffect(() => {
    window.electron.onSubscribeJobResults((_event, id, result) => {
      const newJobResult = {
        id: `result ${id.toString()}`,
        content: result,
      };
      setJobResults((prevJobResults) => [...prevJobResults, newJobResult]);
    });
  }, []);

  const generateUuid = () => {
    return (
      Math.random().toString() +
      Math.random().toString() +
      Math.random().toString()
    );
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    const id = generateUuid();
    const status = await window.electron.publishJob(id, jobContent);

    setJobResults((prevJobResults) => [
      ...prevJobResults,
      {
        id: `job ${id.toString()}`,
        content: status,
      },
    ]);
  };

  const clear = () => {
    setJobResults([]);
  };

  return (
    <Grid container spacing={3} sx={{ margin: '0 0 2rem 0' }}>
      <Grid item xs={3} />
      <Grid item xs={6}>
        {/* <Divider sx={{margin:"1rem 0 1rem 0", borderBottomWidth: 1.5}}/> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            marginBottom: '0.5rem',
          }}
        >
          <Typography fontSize="24px">Submit Jobs</Typography>
        </Box>
        <form onSubmit={handleJobSubmit}>
          <FormControl>
            <FormLabel>Job</FormLabel>
            <TextField
              onChange={(e) => setJobContent(e.target.value)}
              multiline
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ backgroundColor: 'purple' }}
            >
              Submit Job
            </Button>
          </FormControl>
        </form>
        <Grid>
          <Typography>
            Job Results
            <Button onClick={clear}>Clear</Button>
          </Typography>
          {jobResults.map((result) => {
            return (
              <Alert key={result.id}>
                <Typography noWrap>{result.id}</Typography>
                {result.content}
              </Alert>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}
