import React, { useState, useRef } from 'react';
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
import { PaymentFormSchema } from '../common/FormSchema';
import TextFieldWrapper from '../common/TextField';
import handlePay from './handlePay';

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

// interface PaymentPopoverProps {
//   open: boolean;
//   setOpen: (_value: boolean) => void;
//   balance: number;
//   isTransactionPending: boolean;
//   setIsTransactionPending: (_value: boolean) => void;
// }
// const PaymentPopover: React.FC<PaymentPopoverProps> = ({
const PaymentPopover = ({
  open,
  setOpen,
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
      console.log('amount', amount);
      const senderAddress = '0xA32fE9BC86ADF555Db1146ef44eb7fFEB54c86CA';
      const contractAddress = '0xe3ed4fd891fEf89Cb5ED7f609fEDEB87ddcC864c';
      await handlePay(provider, senderAddress, contractAddress, amount);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
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
        <Stack sx={{ alignItems: 'center', padding: "1.5rem 0" }}>
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
