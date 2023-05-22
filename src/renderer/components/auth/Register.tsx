import { Box, Typography, Button, Stack, Container } from '@mui/material';
import {
  generateMnemonicAndKeyPair,
  uint8ArrayToDecimal,
  utf8ToHex, 
  encryptWithPassword
} from '../../utils/cryptoUtils';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import TextFieldWrapper from '../../utils/TextField';
import FormSchema from '../../utils/FormSchema';
import { createAccount } from '../../services/RegistrationServices';
import { createKeyPair } from '../../services/DIDServices';
import { useNavigate } from 'react-router-dom';
import logoBlack from '../../../../assets/logo-black.png';
import { generateRandomString } from '../../utils/generateRandomString';

const Register = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const did = window.electron.store.get('did');
  const handleSubmit = async (values, formActions) => {
    formActions.resetForm();
    const { password } = values;
    const { mnemonic, publicKey, privateKey, publicKeyCompressed } = await generateMnemonicAndKeyPair();
    const data = await createAccount({
      email: 'placeholder-' + generateRandomString(),
      password: 'placeholder-pw',
      publicKey: uint8ArrayToDecimal(publicKey),
      publicKeyWallet: uint8ArrayToDecimal(publicKey),
    });
    const { did, credential } = data;
    window.electron.store.set('mnemonic', mnemonic);
    window.electron.store.set('publicKeyCompressed', utf8ToHex(publicKeyCompressed));
    window.electron.store.set('publicKey', utf8ToHex(publicKey));
    window.electron.store.set('privateKey', encryptWithPassword(utf8ToHex(privateKey), password));
    window.electron.store.set('did', did);
    window.electron.store.set('credential', JSON.stringify({ credential: credential.result }));
    console.log('saved to electron store');
    navigate('/mnemonics');
  };

  return (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={FormSchema}
      onSubmit={(values, formActions) => {
        handleSubmit(values, formActions);
      }}
    >
      {() => (
        <Form>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src={logoBlack} width="50%" height="50%" />
              <Typography variant="h5" py={2}>
                CREATE ACCOUNT
              </Typography>
              <Typography
                fontSize="12px"
                maxWidth={'20rem'}
                textAlign="center"
                marginBottom="1rem"
              >
                {did
                  ? 'You already have an existing account on this device, creating an account will overwrite the existing one.'
                  : 'You do not have an account set up on this device. Please register to create a new wallet and seed phrase'}
              </Typography>
              <Typography variant="h6" align="center" color="red">
                {error}
              </Typography>
              {/* <TextFieldWrapper
                                margin="dense"
                                name="email"
                                placeholder="Enter email"
                                autoComplete="off"
                                label="Email"

                            /> */}
              <TextFieldWrapper
                margin="dense"
                name="password"
                placeholder="Enter password"
                autoComplete="off"
                label="Password"
                type="password"
              />

              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button variant="contained" color="secondary" type="submit">
                  Create Account
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/login')}
                >
                  Back
                </Button>
              </Stack>
            </Box>
          </Container>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
