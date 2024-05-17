import path from 'path';
import { CID, create, globSource } from 'ipfs-http-client';
import { BrowserWindow, dialog } from 'electron';
import Channels from '../common/channels';
const os = require('os');
const fs = require('fs-extra');

let ipfsFilesDir: string;
if (process.platform === 'win32') {
  const baseDir = path.join(process.env.LOCALAPPDATA, '.MECA'); // Use LOCALAPPDATA for Windows
  ipfsFilesDir = path.join(baseDir, 'ipfsFiles');
  fs.ensureDirSync(ipfsFilesDir);
} else {
  const baseDir = path.join(os.homedir(), '.MECA');
  ipfsFilesDir = path.join(baseDir, 'ipfsFiles');
  fs.ensureDirSync(ipfsFilesDir);
}
export const getIpfsFilesDir = ipfsFilesDir;

const IPFS_NODE_URL = process.env.IPFS_NODE_URL || 'http://localhost:5001';
const client = create({ IPFS_NODE_URL });

export const openFileDialog = async (event) => {
  let win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      // win here is to ensure user can only interact with the dialog
      properties: ['openFile'], // Allows users to select files only
    });
    if (canceled) {
      return;
    }
    event.reply(Channels.SELECTED_FILE, filePaths[0]);
  }
  // Assuming `filePaths[0]` is the path to the file you want to upload to IPFS
};

export const openFolderDialog = async (event) => {
  let win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'], // Allows users to select directories only
    });

    if (canceled) {
      return;
    }
    // Assuming `filePaths[0]` is the path to the directory you want to upload to IPFS
    event.reply(Channels.SELECTED_FOLDER, filePaths[0]);
  }
};

export const testGenerateLargeFile = async (event, sizeInMB: number) => {
  const filePath = path.join(ipfsFilesDir, 'largeFile.txt');

  generateLargeFile(filePath, sizeInMB)
    .then(() => {
      event.reply('IPFS_ADD_LARGE_FILE_RESPONSE', true, filePath);
    })
    .catch((error) => {
      console.error('Error generating large file:', error);
      event.reply('IPFS_ADD_LARGE_FILE_RESPONSE', false, null, error.message);
    });
};

export const uploadFileToIPFS = async (event, filePath: string) => {
  try {
    const content = await fs.promises.readFile(filePath);
    const fileName = path.basename(filePath);
    const files = [
      {
        path: fileName,
        content,
      },
    ];

    // Use client.addAll to upload with the wrapping directory
    const addOptions = {
      pin: true,
      wrapWithDirectory: true,
      timeout: 10000,
    };
    let cid;
    for await (const file of client.addAll(files, addOptions)) {
      console.log(file);
      cid = file.cid.toString(); // This will update with each file, ending with the CID of the directory
    }
    return cid;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

export const uploadFolderToIPFS = async (event, folderPath: string) => {
  const globSourceOptions = { recursive: true };
  const addOptions = {
    pin: true,
    wrapWithDirectory: true,
    timeout: 10000,
  };
  try {
    let cid;
    for await (const file of client.addAll(
      globSource(folderPath, globSourceOptions),
      addOptions
    )) {
      console.log(file);
      cid = file.cid.toString(); // Update cid with each file, the last one will be the wrapping directory
    }
    return cid;
  } catch (error) {
    console.error('Error uploading folder to IPFS:', error);
    throw error;
  }
};

export const downloadFromIPFS = async (event, cid: string) => {
  console.log('cid', cid);
  try {
    for await (const file of client.get(cid)) {
      console.log('file', file);
      const outputPath = path.join(ipfsFilesDir, file.path);
      console.log('outputPath', outputPath);

      if (file.content) {
        console.log('file.content', file.content);
        await fs.ensureDir(path.dirname(outputPath));
        const writable = fs.createWriteStream(outputPath);
        for await (const chunk of file.content) {
          writable.write(chunk);
        }
        writable.end();
      } else {
        await fs.ensureDir(outputPath);
      }
    }
    console.log('Download complete');
    return `Content downloaded to ${ipfsFilesDir}`;
  } catch (error) {
    console.error('Error downloading content from IPFS:', error);
    throw error;
  }
};

export const readFirstLineOfFileInFolder = async (event, cid: string) => {
  try {
    const files = [];
    for await (const file of client.ls(cid)) {
      files.push(file);
    }

    // Assuming the text file you want to read is the first file in the folder
    // Adjust this logic to find the specific file if necessary
    if (files.length > 0) {
      const fileCid = files[0].cid.toString();

      const chunks = [];
      for await (const chunk of client.cat(fileCid)) {
        chunks.push(chunk);
      }
      const content = Buffer.concat(chunks).toString('utf8');

      // Get the first line of the file content
      const firstLine = content.split('\n')[0];
      console.log(`First line of the file: ${firstLine}`);

      return 'OK';
    } else {
      console.log('No files found in the folder.');
      return 'No files found in the folder.';
    }
  } catch (error) {
    console.error(`Error reading file from IPFS:`, error);
    return 'Error';
  }
};

export const getLocalFile = async (event, cid: string, fileName: string) => {
  const filePath = path.join(ipfsFilesDir, cid, fileName);
  try {
    const content = await fs.promises.readFile(filePath);
    return content;
  } catch (error) {
    console.error(`Error reading local file ${filePath}:`, error);
    return null;
  }
};

export const deleteFolder = async (event, cid: string) => {
  const folderPath = `${ipfsFilesDir}/${cid}`;

  try {
    await fs.remove(folderPath);
    console.log(`Successfully deleted local folder at ${folderPath}`);
    return true;
  } catch (error) {
    console.error(`Error deleting local folder at ${folderPath}:`, error);
    return false;
  }
};

export const checkFolderExists = async (event, cid: string) => {
  // Construct the full path to the folder
  const folderPath = `${ipfsFilesDir}/${cid}`;

  try {
    const exists = await fs.pathExists(folderPath);
    console.log(`Folder ${cid} exists: ${exists}`);
    return exists;
  } catch (error) {
    console.error(`Error checking existence of folder ${cid}:`, error);
    return false;
  }
};

const generateLargeFile = async (filePath: string, sizeInMB: number) => {
  // Delete the file first if it exists
  // await fs.remove(filePath);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    const oneMB = 1024 * 1024;
    const chunkSize = 1024;
    const totalChunks = (sizeInMB * oneMB) / chunkSize;
    let written = 0;

    stream.on('error', reject);

    const writeChunk = () => {
      while (written < totalChunks) {
        // Generate a chunk with random numbers and a newline at the end
        const dataChunk = generateRandomNumbers(chunkSize - 1) + '\n';
        if (!stream.write(dataChunk)) {
          written++;
          return stream.once('drain', writeChunk);
        }
        written++;
      }
      if (written >= totalChunks) {
        stream.end();
      }
    };

    stream.on('finish', () => {
      console.log(`Finished writing ${sizeInMB}MB to ${filePath}`);
      resolve(filePath);
    });

    writeChunk();
  });
};

const generateRandomNumbers = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    result += randomDigit.toString();
  }
  return result;
};

export const catFile = async (event, cid: string, extension: string) => {
  const chunks = [];

  // find extension in folder
  for await (const file of client.ls(cid)) {
    if (file.name.endsWith(extension)) {
      for await (const chunk of client.cat(file.cid)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks).toString();
    }
  }

  return null;
};

export const statObject = async (event, cid: string) => {
  return client.object.stat(new CID(cid));
};

// unused

// // Handler to add data to IPFS
// ipcMain.handle(Channels.IPFS_ADD, async (event, data) => {
//   try {
//     const { cid } = await client.add(data);
//     return cid.toString();
//   } catch (error) {
//     console.error('Error adding data to IPFS:', error);
//     throw error; // This will be sent as an error to the renderer
//   }
// });
// ipcMain.handle('upload-file-to-ipfs', async (event, filePath) => {
//   try {
//     const file = await fs.promises.readFile(filePath);
//     const { cid } = await client.add({ path: path.basename(filePath), content: file });
//     return cid.toString();
//   } catch (error) {
//     console.error('Error uploading file to IPFS:', error);
//     throw error;
//   }
// });
// // Handler to fetch data from IPFS
// ipcMain.handle(Channels.IPFS_CAT, async (event, cid) => {
//   try {
//     const chunks = [];
//     for await (const chunk of client.cat(cid)) {
//       chunks.push(chunk);
//     }
//     return Buffer.concat(chunks).toString(); // Assuming the data is text
//   } catch (error) {
//     console.error('Error fetching data from IPFS:', error);
//     throw error; // This will be sent as an error to the renderer
//   }
// });

// ipcMain.handle('download-from-ipfs', async (event, cid) => {
//   console.log("Starting download for CID:", cid);
//   try {
//     let unwrappedBasePath = ""; // To store the unwrapped base path after identifying the wrapping layer

//     for await (const file of client.get(cid)) {
//       // Determine the unwrapped base path on the first iteration
//       if (!unwrappedBasePath) {
//         // Skip the first level directory (wrapping layer) by adjusting the basePath
//         const firstSlashIndex = file.path.indexOf('/');
//         if (firstSlashIndex !== -1) {
//           unwrappedBasePath = path.join(ipfsFilesDir, file.path.substring(0, firstSlashIndex));
//           await fs.ensureDir(unwrappedBasePath); // Ensure this adjusted base directory exists
//         } else {
//           // If there's no slash, it means it's a single file wrapped in a directory
//           unwrappedBasePath = ipfsFilesDir; // Use the ipfsFilesDir directly
//         }
//       }

//       // For the actual content, adjust the output path to remove the wrapping layer
//       const relativePath = file.path.substring(file.path.indexOf('/') + 1);
//       const outputPath = path.join(ipfsFilesDir, relativePath);

//       if (file.content) {
//         // It's a file; write its content to the outputPath
//         await fs.ensureDir(path.dirname(outputPath)); // Ensure directory for the file exists
//         const content = [];
//         for await (const chunk of file.content) {
//           content.push(chunk);
//         }
//         await fs.writeFile(outputPath, Buffer.concat(content));
//       } else if (relativePath) {
//         // It's a directory and not the wrapping layer; ensure it exists
//         await fs.ensureDir(outputPath);
//       }
//     }

//     console.log("Download complete");
//     return `Content downloaded successfully to ${unwrappedBasePath}`;
//   } catch (error) {
//     console.error('Error downloading content from IPFS:', error);
//     throw error;  // Propagate the error back to the renderer
//   }
// });
