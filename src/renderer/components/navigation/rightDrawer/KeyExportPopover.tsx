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
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface KeyExportPopoverProps {
  open: boolean;
  setOpen: (_value: boolean) => void;
}
const KeyExportPopover: React.FC<KeyExportPopoverProps> = ({
  open,
  setOpen,
}) => {
  const [reveal, setReveal] = useState(false);
  const mnemonics = window.electron.store.get('mnemonic');
  const handleClose = () => {
    setOpen(false);
    setReveal(false);
  };
  const handleRevealClick = () => {
    setReveal(true);
  };
  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(mnemonics)
      .then(() => {
        return null;
      })
      .catch((err) => {
        console.error('Failed to copy mnemonics to clipboard: ', err);
        throw err;
      });
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', marginTop: '1rem' }}>
        MNEMONICS
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
          This is your private recovery phrase. Use it to import or recover your
          account.
        </Typography>
        <Box
          sx={{
            maxWidth: '25rem',
            minHeight: '5rem',
            backgroundColor: 'customColor.lightGrey',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '1rem 1rem 1rem 1rem',
            borderRadius: '0.5rem',
          }}
        >
          {reveal ? (
            mnemonics
              .trim()
              .split(' ')
              .map((word: string) => (
                <Typography key={word} variant="body1" mr="1rem">
                  {word}
                </Typography>
              ))
          ) : (
            <Typography variant="body1">Click to reveal</Typography>
          )}
          {!reveal && (
            <IconButton size="small" onClick={handleRevealClick}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          )}
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
        <Button sx={{ mx: '1rem', px: '1rem' }} onClick={handleCopyToClipboard}>
          Copy to Clipboard
        </Button>
        <Button sx={{ mx: '1rem', px: '1rem' }} onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default KeyExportPopover;
