import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import { JobResult } from './utils/jobs';
import { useSelector } from "react-redux";
import { handleRegisterClient } from './utils/handleRegistration';

export default function UserJobSubmission() {
  const [jobContent, setJobContent] = useState('');
  const [jobResults, setJobResults] = useState<JobResult[]>([]);
  const [open, setOpen] = useState(false);
  const userAccessToken = useSelector((state) => state.accountUser.userAccessToken);

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

  const submitJob = async () => {
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

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (userAccessToken.length === 0) {
      setOpen(true);
    } else {
      await submitJob();
    }
  };
    
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleRegisterClientAndSubmitJob = async () => {
    await handleRegisterClient(); // Handle registration
    await submitJob(); 
    setOpen(false); // Close the dialog
  };

  const handleClear = () => {
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
          <Typography marginTop="1rem" variant="body1" fontSize="36px">Submit Jobs</Typography>
        </Box>
        <form onSubmit={handleJobSubmit}>
          <FormControl sx={{ marginBottom: '1rem', marginTop: "0.5rem" }}>
            <FormLabel>Please enter your Python function or code snippet:</FormLabel>
            <TextField
              onChange={(e) => setJobContent(e.target.value)}
              multiline
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              color="secondary"
              sx={{ marginTop: '1rem' }}
            >
              Submit Job
            </Button>
          </FormControl>
        </form>
        <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Client Registration Required</DialogTitle>
        <DialogContent>
          <Typography variant="body1">You need to be registered to submit a job. Please register as a client.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleRegisterClientAndSubmitJob} autoFocus>
            Register as Client
          </Button>
        </DialogActions>
      </Dialog>
        <Grid>
          <Typography>
            Job Results
            
          </Typography>
          {jobResults.map((result) => {
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
          <Button fullWidth variant="contained" color="secondary" onClick={handleClear}>Clear Job</Button>
            </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
