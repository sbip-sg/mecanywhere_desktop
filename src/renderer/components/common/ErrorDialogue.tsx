import React, { FC } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
}

const ErrorDialog: FC<ErrorDialogProps> = ({ open, onClose, errorMessage }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          padding: '1rem',
          minWidth: '30%',
        },
      }}
    >
      <DialogTitle sx={{ color: 'error.main' }}>Error</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.primary', fontSize: '18px' }}>
          {errorMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
