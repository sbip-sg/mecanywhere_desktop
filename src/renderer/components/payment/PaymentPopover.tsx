import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import 'react-datepicker/dist/react-datepicker.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { PaymentFormSchema } from '../componentsCommon/FormSchema';
import TextFieldWrapper from '../componentsCommon/TextField';
import handlePay from './handlePay';
import { SDKProvider } from '../../../node_modules/@metamask/sdk';

interface FormValues {
  amount: number;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PaymentPopoverProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  account: string;
  balance: number;
  clientBalance: number;
  provider: SDKProvider | undefined;
  setIsTransactionPending: React.Dispatch<React.SetStateAction<boolean>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentPopover: React.FC<PaymentPopoverProps> = ({
  open,
  setOpen,
  account,
  balance,
  clientBalance,
  provider,
  setIsTransactionPending,
  setBalance,
  setErrorMessage,
  setErrorDialogOpen,
}) => {
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const handleClose = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    setOpen(false);
  };

  const handleSubmit = async (
    values: FormValues,
    formActions: FormikHelpers<FormValues>
  ) => {
    try {
      setIsTransactionPending(true);
      setOpen(false);
      formActions.resetForm();
      const { amount } = values;
      const senderAddress = account;
      const contractAddress = '0xe3ed4fd891fEf89Cb5ED7f609fEDEB87ddcC864c';
      await handlePay(provider, senderAddress, contractAddress, amount);
      setBalance(balance - amount);
      setIsTransactionPending(false);
    } catch (error) {
      setErrorMessage(`Payment Failed: ${error}`);
      setErrorDialogOpen(true);
      setIsTransactionPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', marginTop: '1rem' }}>
        Make Payment
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="body1" padding="1rem" textAlign="center">
          Please input the amount you would like to pay or stake to the
          MECAnywhere Smart Contract:
        </Typography>
        <Stack sx={{ alignItems: 'center', padding: '1.5rem 0' }}>
          <Typography variant="subtitle1" textAlign="center">
            Your MECAnywhere balance: {balance}
          </Typography>
          <Typography variant="subtitle1" textAlign="center">
            {`Your account balance: ${clientBalance.toFixed(5)} ethers`}
          </Typography>
        </Stack>
        <Formik
          innerRef={formikRef}
          initialValues={{ amount: 0 }}
          validationSchema={PaymentFormSchema(clientBalance)}
          onSubmit={(values, formActions) => {
            handleSubmit(values, formActions);
          }}
        >
          {() => (
            <Form>
              <TextFieldWrapper
                name="amount"
                placeholder="Enter Amount"
                type="any"
                inputProps={{ style: { textAlign: 'center' } }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '1rem 0 2.5rem 0',
                }}
              >
                <Button sx={{ mx: '1rem', px: '1rem' }} type="submit">
                  Confirm
                </Button>
                <Button sx={{ mx: '1rem', px: '1rem' }} onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPopover;
