import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import 'react-datepicker/dist/react-datepicker.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import IconButton from '@mui/material/IconButton';
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface QRCodePopoverProps {
  open: boolean;
  setOpen: (_value: boolean) => void;
  qrCodeUrl: string;
  setQrCodeUrl: (_value: string) => void;
}
const QRCodePopover: React.FC<QRCodePopoverProps> = ({ open, setOpen, qrCodeUrl, setQrCodeUrl }) => {
  const handleClose = () => {
    setOpen(false);
    setQrCodeUrl('')
  };
  const canvasRef = useRef(null);

  useEffect(() => {
    if (open && qrCodeUrl) {
      QRCode.toCanvas(canvasRef.current, qrCodeUrl, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [open, qrCodeUrl]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', marginTop: '1rem' }}>
        QRCode
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="subtitle1" padding="1rem" textAlign="center">
          Scan with your Metamask App
        </Typography>
        <Box
          sx={{
            // maxWidth: '25rem',
            // height: '5rem',
            // minHeight: '5rem',
            // backgroundColor: 'customColor.lightGrey',
            height:'100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '1rem 1rem 1rem 1rem',
            borderRadius: '0.5rem',
          }}
        >
          <canvas ref={canvasRef} />
        </Box>
      </DialogContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem 0 2.5rem 0',
        }}
      >
        <Button sx={{ mx: '1rem', px: '1rem' }} onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default QRCodePopover;
