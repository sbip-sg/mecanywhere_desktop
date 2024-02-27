import React, { useState } from 'react';
import { Stack, Typography, Button, TextField } from '@mui/material';

const UploadTask = () => {
  const [filePath, setFilePath] = useState('');
  const [folderPath, setFolderPath] = useState('');
  const [cid, setCid] = useState('');

  const handleSelectFile = () => {
    window.electron.openFileDialog();
    window.electron.onFileSelected((event, path) => {
      setFilePath(path)
    });
  };


  const handleSelectFolder = () => {
    window.electron.openFolderDialog()
    window.electron.onFolderSelected((event, directoryPath) => {
      setFolderPath(directoryPath)
    });
  };

  const uploadFile = async () => {
    if (!filePath) {
      console.error('No file selected to upload');
      return;
    }
    try {
      const cid = await window.electron.uploadFileToIPFS(filePath);
      console.log(`File uploaded to IPFS with CID: ${cid}`);
    } catch (error) {
      console.error('Failed to upload file to IPFS:', error);
    }
  };

  const uploadFolder = async () => {
    if (!folderPath) {
      console.error('No folder selected to upload');
      return;
    }
    try {
      const cid = await window.electron.uploadFolderToIPFS(folderPath);
      console.log(`Folder uploaded to IPFS with CID: ${cid}`);
    } catch (error) {
      console.error('Failed to upload folder to IPFS:', error);
    }
  };

  const handleDownload = async () => {
    try {
      console.log("handleDownload", cid)
      await window.electron.downloadFromIPFS(cid);
    } catch (err) {
      console.error('Error downloading from IPFS:', err);
    }
  };

  const handleGenerateLargeFile = async () => {
    try {
      await window.electron.generateLargeFile(12);
    } catch (err) {
      console.error('Error generating file:', err);
    
    }
  }
  return (
    <Stack sx={{ height: '100%', width: '100%', gap: 2, alignItems: 'center', marginTop: "2rem" }}>
       <Typography variant="h3" sx={{ padding: '1rem 0 3rem 0' }}>
        Upload Task
      </Typography>
      <Stack sx={{marginBottom:"1rem", width: '100%', alignItems: 'center'}}>

      <Button sx={{width:"50%", backgroundColor: 'primary.main', color: 'text.primary'}} onClick={handleSelectFile}>Select File</Button>
      <TextField
        label="Selected File Path"
        value={filePath}
        sx={{width:"50%", my: '0.5rem'}}
        disabled
        InputLabelProps={{
          shrink: true,
        }}
        />
        
      <Button sx={{width:"50%", backgroundColor: 'secondary.main', color: 'text.primary'}} onClick={uploadFile} disabled={!filePath}>
        Upload Selected File to IPFS
      </Button>
        </Stack>
        <Stack sx={{marginBottom:"1rem", width: '100%', alignItems: 'center'}}>

      <Button sx={{width:"50%", backgroundColor: 'primary.main', color: 'text.primary'}} onClick={handleSelectFolder}>Select Folder</Button>
      <TextField
        label="Selected Folder Path"
        value={folderPath}
        sx={{width:"50%", my: '0.5rem'}}
        disabled
        InputLabelProps={{
          shrink: true,
        }}
      />
      
      <Button sx={{width:"50%", backgroundColor: 'secondary.main', color: 'text.primary' }} onClick={uploadFolder} disabled={!folderPath}>
        Upload Selected Folder to IPFS
      </Button>
      </Stack>

      <TextField
      sx={{width:"50%"}}
        type="text"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
        placeholder="Enter CID to download"
      />
      <Button sx={{width:"50%"}} onClick={handleDownload} disabled={!cid}>
        Download From IPFS
      </Button>
      <Button sx={{width:"50%"}} onClick={handleGenerateLargeFile}>
        Test Generate Large File
      </Button>
    </Stack>
  );
};

export default UploadTask;
