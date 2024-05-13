// Function to retrieve folder and metadata using CID
export async function retrieveIPFSFolderMetadata(cid: string): Promise<any> {
  const name = await window.electron.catFile(cid, 'name.txt');
  const description = await window.electron.catFile(cid, 'description.txt');
  const stats = await window.electron.statObject(cid);
  const sizeFolder = stats.CumulativeSize;
  return { name, description, sizeFolder };
}

const IPFSService = {
  retrieveIPFSFolderMetadata,
};

export default IPFSService;
