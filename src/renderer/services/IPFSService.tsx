import { create } from 'ipfs-http-client';

// Create an IPFS client
const ipfs = create();

// Function to retrieve folder and metadata using CID
export async function retrieveIPFSFolderMetadata(cid: string): Promise<any> {
  // try {
  //   const nameChunks = [];
  //   for await (const chunk of ipfs.cat(`${cid}/name.txt`)) {
  //     nameChunks.push(chunk);
  //   }
  //   const name = Buffer.concat(nameChunks).toString('utf8');
  //   const descriptionChunks = [];
  //   for await (const chunk of ipfs.cat(`${cid}/description.txt`)) {
  //     descriptionChunks.push(chunk);
  //   }
  //   const description = Buffer.concat(descriptionChunks).toString('utf8');

  //   console.log('Name:', name, 'Description:', description);

  //   return {
  //     name,
  //     description,
  //   };
  // } catch (error) {
  //   console.error('Error retrieving folder and metadata:', error);
  //   throw error;
  // }
  return {
    name: await window.electron.catFile(cid, 'name.txt'),
    description: await window.electron.catFile(cid, 'description.txt'),
    sizeFolder: '1',
  };
}

const IPFSService = {
  retrieveIPFSFolderMetadata,
};

export default IPFSService;
