import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import 'react-datepicker/dist/react-datepicker.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikHelpers, FormikProps } from 'formik';
import { WithdrawalFormSchema } from '../componentsCommon/FormSchema';
import TextFieldWrapper from '../componentsCommon/TextField';
import handleWithdraw from './handleWithdraw';

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

interface WithdrawalPopoverProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  balance: number;
  setIsTransactionPending: React.Dispatch<React.SetStateAction<boolean>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const WithdrawalPopover: React.FC<WithdrawalPopoverProps> = ({
  open,
  setOpen,
  balance,
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
      const destinationAddress = '0xA32fE9BC86ADF555Db1146ef44eb7fFEB54c86CA';
      await handleWithdraw(destinationAddress, amount);
      setBalance(balance - amount);
      setIsTransactionPending(false);
    } catch (error) {
      setIsTransactionPending(false);
      setErrorMessage(`Withdrawal Failed: ${error}`);
      setErrorDialogOpen(true);
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
        Make Withdrawal
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
          Please input the amount you would like to withdraw from your available
          balance in MECAnywhere Smart Contract:
        </Typography>
        <Typography variant="subtitle1" padding="1rem" textAlign="center">
          Your MECAnywhere balance: {balance}
        </Typography>
        <Formik
          innerRef={formikRef}
          initialValues={{ amount: balance }}
          validationSchema={WithdrawalFormSchema(balance)}
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

export default WithdrawalPopover;
