import { Button, Box } from '@mui/material';

const ConnectedComponent = ({
  handleDisconnect,
  handlePay,
  handleWithdraw,
  account,
  chainId,
}) => {
  return (
    <div>
      <h1>ConnectedComponent</h1>
      <Button onClick={handleDisconnect}>Disconnect</Button>
      <Button onClick={handlePay}>Pay To Contract</Button>
      <Button onClick={handleWithdraw}>Withdraw From Contract</Button>
      <Box id="account">Account: {account}</Box>
      <Box id="chain">Chain ID: {chainId}</Box>
    </div>
  );
};

export default ConnectedComponent;
