import { Button } from '@mui/material';

const DisconnectedComponent = ({ handleConnect }) => {
  return (
    <div>
      <h1>DisconnectedComponent</h1>
      <Button onClick={handleConnect}>Connect</Button>
    </div>
  );
};

export default DisconnectedComponent;
