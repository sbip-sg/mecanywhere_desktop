import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const Test = () => {
  const [filePath, setFilePath] = useState('');
  const [folderPath, setFolderPath] = useState('');
  const [cid, setCid] = useState('');

  const handleSelectFile = () => {
    window.electron.openFileDialog();
    window.electron.onFileSelected((event, path) => {
      setFilePath(path)
    });
  };


  const handleSelectDirectory = () => {
    window.electron.openDirectoryDialog()
    window.electron.onDirectorySelected((event, directoryPath) => {
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
      console.log("aaaaaaaa", cid)
      await window.electron.downloadFromIPFS(cid);
    } catch (err) {
      console.error('Error downloading from IPFS:', err);
    }
  };
  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button onClick={handleSelectFile}>Select File</Button>
      <TextField
        label="Selected File Path"
        value={filePath}
        fullWidth
        disabled
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button onClick={handleSelectDirectory}>Select Directory</Button>
      <TextField
        label="Selected Folder Path"
        value={folderPath}
        fullWidth
        disabled
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button onClick={uploadFile} disabled={!filePath}>
        Upload Selected File to IPFS
      </Button>
      
      <Button onClick={uploadFolder} disabled={!folderPath}>
        Upload Selected Folder to IPFS
      </Button>
      <TextField
        type="text"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
        placeholder="Enter CID to download"
      />
      <Button onClick={handleDownload} disabled={!cid}>
        Download From IPFS
      </Button>
    </Box>
  );
};

export default Test;

// import React, { useState, useEffect } from 'react';
// import { Box, Button, TextField } from '@mui/material';

// const Test = () => {
//   const [filePath, setFilePath] = useState("")
//   const [folderPath, setFolderPath] = useState("")
//   async function addData() {
//     try {
//       const cid = await window.electron.addDataToIPFS(
//         'Hello from the renderer!'
//       );
//       console.log('Data added to IPFS with CID:', cid);
//     } catch (error) {
//       console.error('Error adding data to IPFS:', error);
//     }
//   }
//   async function fetchData(cid) {
//     try {
//       const data = await window.electron.fetchDataFromIPFS(cid);
//       console.log('Fetched data from IPFS:', data);
//       return data;
//     } catch (error) {
//       console.error('Error fetching data from IPFS:', error);
//     }
//   }

//   const handleGenerateFile = () => {
//     window.electron.generateLargeFile(10) // Example: 10MB
//         .then(filePath => {
//             console.log(`File generated at: ${filePath}`);
//             // Handle success, e.g., display a message to the user
//         })
//         .catch(error => {
//             console.error(`Error generating file: ${error.message}`);
//             // Handle error, e.g., display an error message
//         });
// };

// const handleSelectFile = () => {
//   window.electron.openFileDialog();
//   window.electron.onFileSelected((event, filePath) => {
//       console.log('Selected file:', filePath);
//       // Do something with the selected file path, like upload to IPFS
//   });
// };

// const handleSelectDirectory = () => {
//   window.electron.openDirectoryDialog();
//   window.electron.onDirectorySelected((event, directoryPath) => {
//       console.log('Selected directory:', directoryPath);
//       // Do something with the selected directory path
//   });
// };

// async function uploadFile() {
//   try {
//     const filePath = '/path/to/desktop/test_upload/test_upload.txt'; // Replace with actual path
//     const cid = await window.electron.uploadFileToIPFS(filePath);
//     console.log(`File uploaded to IPFS with CID: ${cid}`);
//   } catch (error) {
//     console.error('Failed to upload file to IPFS:', error);
//   }
// }

// async function uploadFolder() {
//   try {
//     const folderPath = '/path/to/desktop/test_upload'; // Replace with actual path
//     await window.electron.uploadFolderToIPFS(folderPath);
//     console.log('Folder uploaded to IPFS successfully');
//   } catch (error) {
//     console.error('Failed to upload folder to IPFS:', error);
//   }
// }

//   // Example usage, replace 'yourCIDhere' with an actual CID
//   return (
//     <Box sx={{ height: '100%', width: '100%' }}>
//       <Button onClick={addData}>upload task</Button>
//       <TextField />
//       <Button
//         onClick={() =>
//           fetchData('QmdTVkVYySgxuYN49Q2bqVNDtwmMdHPN3VCK7NcCmibSoQ')
//         }
//       >
//         retrieve task
//       </Button>
//       <Button onClick={handleGenerateFile}>
//         test add 1gb file
//       </Button>

//       <Button onClick={handleSelectFile}>Select File</Button>
//             <Button onClick={handleSelectDirectory}>Select Directory</Button>
//     </Box>
//   );
// };

// export default Test;
