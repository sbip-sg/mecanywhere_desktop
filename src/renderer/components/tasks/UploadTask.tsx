import { useState } from 'react';
import {
  Stack,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { addTaskByDeveloper } from 'renderer/services/TaskContractService';
import reduxStore, { RootState } from 'renderer/redux/store';
import { useSelector } from 'react-redux';

const UploadTask = () => {
  const [folderPath, setFolderPath] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [cid, setCid] = useState('');
  const [published, setPublished] = useState(false);
  const paymentProviderConnected = useSelector(
    (state: RootState) => state.paymentProviderReducer.connected
  );

  const handleSelectFolder = () => {
    window.electron.openFolderDialog();
    window.electron.onFolderSelected((event, directoryPath) => {
      setFolderPath(directoryPath);
    });
  };

  const uploadFolder = async () => {
    if (!folderPath) {
      console.error('No folder selected to upload');
      return;
    }
    try {
      const cid = await window.electron.uploadFolderToIPFS(folderPath);
      console.log(`Folder uploaded to IPFS with CID: ${cid}`);
      setUploaded(true);
      setCid(cid);
    } catch (error) {
      console.error('Failed to upload folder to IPFS:', error);
    }
  };

  const handleClearClick = () => {
    setFolderPath('');
  };

  const publishToMECA = async () => {
    if (!cid) {
      console.error('No CID to publish');
      return;
    }
    try {
      const paymentProvider = reduxStore.getState().paymentProviderReducer.sdkProvider;
      const account = reduxStore.getState().paymentProviderReducer.accounts[0];
      const res = await addTaskByDeveloper(cid, 1, 0, 100, paymentProvider, account);
      console.log(`Folder published to MECA Network: ${res}`);
      setPublished(true);
    } catch (error) {
      console.error('Failed to publish folder to MECA Network:', error);
    }
  };


  return (
    <Stack
      sx={{
        height: '100%',
        width: '100%',
        gap: 2,
        alignItems: 'center',
        marginTop: '2rem',
      }}
    >
      <Typography variant="h3" sx={{ padding: '1rem 0 3rem 0' }}>
        Upload Task To IPFS
      </Typography>
      <Stack sx={{ marginBottom: '1rem', width: '40%', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%' }}>
          <Button
            sx={{
              px: '1rem',
              backgroundColor: 'primary.main',
              color: 'text.primary',
            }}
            onClick={handleSelectFolder}
          >
            Select Folder
          </Button>
        </Box>
        <TextField
          label="Selected Folder Path"
          value={folderPath}
          sx={{
            width: '100%',
            my: '1.5rem',
            '& .Mui-focused .MuiIconButton-root': { color: 'primary.main' },
          }}
          disabled
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                sx={{ visibility: folderPath ? 'visible' : 'hidden' }}
                onClick={handleClearClick}
              >
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {uploaded && <CheckIcon sx={{ mr: '0.5rem' }} />}
          <Button
            sx={{
              px: '1rem',
              backgroundColor: 'secondary.contrastText',
              color: 'text.primary',
            }}
            onClick={uploadFolder}
            disabled={!folderPath}
          >
            Upload Folder
          </Button>
        </Box>

        <TextField
          label="Task CID"
          value={cid}
          sx={{
            width: '100%',
            my: '1.5rem',
            '& .Mui-focused .MuiIconButton-root': { color: 'primary.main' },
          }}
          onChange={(e) => setCid(e.target.value)}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {published && <CheckIcon sx={{ mr: '0.5rem' }} />}
          <Button
            sx={{
              px: '1rem',
              backgroundColor: 'secondary.contrastText',
              color: 'text.primary',
            }}
            onClick={publishToMECA}
            disabled={!cid || !paymentProviderConnected}
          >
            Publish to MECA Network
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default UploadTask;
