//scare lady faint task monitor toss stadium law fly path maid electric
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  TextField,
  Grid,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import actions from '../../redux/actionCreators';

const ImportSeedPhrase = () => {
  const [words, setWords] = useState(Array(12).fill(''));
  const [showWords, setShowWords] = useState(false); // State for toggle visibility
  const navigate = useNavigate();
  const handleChange = (index) => (event) => {
    const newWords = [...words];
    newWords[index] = event.target.value;
    setWords(newWords);
  };

  const handlePasteMnemonics = async () => {
    const pastedText = await navigator.clipboard.readText();
    const pastedWords = pastedText.split(/\s+/).slice(0, 12);
    setWords(pastedWords.concat(Array(12 - pastedWords.length).fill('')));
  };

  const toggleVisibility = () => {
    setShowWords(!showWords);
  };

  const handleProceedImportAccount = () => {
    navigate('/register');
    actions.setImportingAccount(true);
  };
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          marginTop: '5rem',
        }}
      >
        <Typography
          variant="h1"
          fontSize="35px"
          letterSpacing="0.1em"
          maxWidth="25rem"
          textAlign="center"
        >
          Import Account From Seed Phrases
        </Typography>
        <Typography variant="body1" textAlign="center" marginTop="2rem">
          To import your account, please paste your 12-word seed phrase into the
          fields below.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '65%',
            margin: '2rem 0 2rem 0',
          }}
        >
          <Grid container spacing={2}>
            {words.map((word, index) => (
              <Grid item xs={2} sm={2} key={index}>
                <TextField
                  label={`word ${index + 1}`}
                  type={showWords ? 'text' : 'password'} // Change type based on visibility
                  variant="outlined"
                  value={word}
                  onChange={handleChange(index)}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              maxWidth: '18rem',
              width: '100%',
              margin: '2rem 0 0 0',
              padding: '0',
            }}
          >
            <Button
              variant="contained"
              onClick={handlePasteMnemonics}
              sx={{
                my: '0.5rem',
                py: '0.5rem',
                color: 'text.primary',
                backgroundColor: 'primary.main',
                fontWeight: '600',
              }}
            >
              Paste From Clipboard
            </Button>
            <Button
              variant="contained"
              onClick={toggleVisibility}
              sx={{
                my: '0.5rem',
                py: '0.5rem',
                color: 'text.primary',
                backgroundColor: 'primary.main',
                fontWeight: '600',
              }}
            >
              <IconButton sx={{ padding: '0 0.7rem 0 0' }}>
                {showWords ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
              {showWords ? 'Hide Mnemonics' : 'Show Mnemonics'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          marginTop: '4rem',
        }}
      >
        <Button
          sx={{ margin: '0 1rem 0 0' }}
          variant="contained"
          onClick={handleProceedImportAccount}
        >
          Import Account
        </Button>
        <Button
          sx={{ margin: '0 1rem 0 0' }}
          variant="contained"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </Box>
    </>
  );
};

export default ImportSeedPhrase;
