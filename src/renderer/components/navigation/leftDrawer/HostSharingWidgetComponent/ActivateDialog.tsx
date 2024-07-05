import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { handleActivateHost } from 'renderer/components/componentsCommon/handleRegistration';
import { getHostInitialStake } from 'renderer/services/HostContractService';
import ActivateFormSchema from 'renderer/components/componentsCommon/FormSchema';
import { Form, Formik, FormikHelpers } from 'formik';
import TextFieldWrapper from 'renderer/components/componentsCommon/TextField';

interface FormValues {
  blockTimeoutLimit: number;
  stake: number;
}

interface ActivateDialogProps {
  open: boolean;
  onActivate: () => void;
  onClose: () => void;
}

const ActivateDialog: React.FC<ActivateDialogProps> = ({
  open,
  onActivate,
  onClose,
}) => {
  const [initialStake, setInitialStake] = useState<number>(0);

  useEffect(() => {
    const getInitialStake = async () => {
      const stakeRes = await getHostInitialStake();
      if (!stakeRes || stakeRes === undefined) {
        throw new Error('Failed to get host initial stake');
      }
      setInitialStake(stakeRes);
    };
    getInitialStake();
  }, []);

  const handleActivate = async (
    values: FormValues,
    formActions: FormikHelpers<FormValues>
  ) => {
    formActions.resetForm();
    const { blockTimeoutLimit, stake } = values;
    await handleActivateHost(blockTimeoutLimit, stake);
    onActivate();
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      PaperProps={{ sx: { padding: '1rem', minWidth: '30%' } }}
    >
      <DialogTitle sx={{ color: 'primary.main' }}>Activate host</DialogTitle>
      <Formik
        initialValues={{ blockTimeoutLimit: 1, stake: initialStake }}
        validationSchema={ActivateFormSchema(initialStake)}
        onSubmit={(values, formActions) => handleActivate(values, formActions)}
      >
        {() => (
          <Form>
            <DialogContent>
              <DialogContentText
                sx={{ color: 'text.primary', fontSize: '18px' }}
              >
                Block timeout limit:
              </DialogContentText>
              <DialogContentText
                sx={{ color: 'text.primary', fontSize: '14px' }}
              >
                This sets the maximum blocks for a host to host tasks.
              </DialogContentText>
              <TextFieldWrapper
                name="blockTimeoutLimit"
                id="blockTimeoutLimit"
                label="Block timeout limit"
                type="number"
                sx={{ margin: '1rem 0', width: '80%' }}
              />
              <DialogContentText
                sx={{ color: 'text.primary', fontSize: '18px' }}
              >
                Stake (ETH):
              </DialogContentText>
              <DialogContentText
                sx={{ color: 'text.primary', fontSize: '14px' }}
              >
                This ensures credibility and can be withdrawn.
              </DialogContentText>
              <TextFieldWrapper
                name="stake"
                id="stake"
                label="Stake (ETH)"
                type="number"
                sx={{ margin: '1rem 0', width: '80%' }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Activate</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ActivateDialog;
