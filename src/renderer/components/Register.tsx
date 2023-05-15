import { Box, Typography, Button, Stack, Container } from '@mui/material';
import {generateMnemonicAndKeyPair, toHexString} from "../utils/generateKeyPairAndMnemonics"
import { useState } from 'react';
import { Formik, Form } from 'formik';
import TextFieldWrapper from 'renderer/utils/TextField';
import FormSchema from 'renderer/utils/FormSchema';
import { createAccount } from '../services/RegistrationServices';
import { createKeyPair } from '../services/DIDServices';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const did = window.electron.store.get('did');
    const handleSubmit = async (values, formActions) => {
        formActions.resetForm();
        const { mnemonic, publicKey, secretKey } = await generateMnemonicAndKeyPair()
        window.electron.store.set('publicKey-wallet', toHexString(publicKey))
        window.electron.store.set('privateKey-wallet', toHexString(secretKey))
        window.electron.store.set('mnemonic', mnemonic)
        // console.log("mnemonics", mnemonic, "keyPair", keyPair);
        // console.log("pkey", publicKey, secretKey)
        // const data = await createAccount({...values, publicKey: toHexString(publicKey)});
        
        const keyPair = await createKeyPair();
        const data = await createAccount({...values, publicKey: keyPair.result.publicKey, publicKeyWallet: toHexString(publicKey)});
        const { did, credential} = data
        window.electron.store.set('publicKey', keyPair.result.publicKey)
        window.electron.store.set('privateKey', keyPair.result.privateKey)
        window.electron.store.set('did', did)
        window.electron.store.set('credential',JSON.stringify({"credential": credential.result}))
        console.log("saved to electron store")
    }

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={FormSchema}
            onSubmit={(values, formActions) => {
                handleSubmit(values, formActions);
            }}>
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
                            <Typography variant="h5" py={2}>
                                CREATE ACCOUNT
                            </Typography>
                            <Typography fontSize="12px" maxWidth={"20rem"}>
                            {did ? "You already have an existing account on this device, creating an account will overwrite the existing one." : ""}
                            </Typography>
                            <Typography variant="h6" align="center" color="red">
                                {error}
                            </Typography>
                            <TextFieldWrapper
                                margin="dense"
                                name="email"
                                placeholder="Enter email"
                                autoComplete="off"
                                label="Email"

                            />
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
                            
                                <Button variant="contained" color="secondary" type="submit">Create Account</Button>
                                <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>Back</Button>
                            </Stack>
                        </Box>
                    </Container>

                </Form>

            )}
        </Formik>
    );
}

export default Register;