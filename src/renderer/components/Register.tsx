import { Box, Typography, Button, Stack, Container } from '@mui/material';
import {generateMnemonicAndKeyPair, toHexString} from "../utils/generateKeyPairAndMnemonics"
import { useState } from 'react';
import { Formik, Form } from 'formik';
import TextFieldWrapper from 'renderer/utils/TextField';
import FormSchema from 'renderer/utils/FormSchema';
import { createUser } from '../services/TestServices';
import { useSelector } from "react-redux";
const Register = () => {
    const [error, setError] = useState(null);
    const [mnemonic, setMnemonic] = useState('');
    const did = window.electron.store.get('did');
    const handleSubmit = async (values, formActions) => {
        console.log("register", values)
        const { mnemonic, publicKey, secretKey } = await generateMnemonicAndKeyPair()
        setMnemonic(mnemonic);
        console.log("mnemonics and keypair", mnemonic, toHexString(publicKey), toHexString(secretKey))
        
        formActions.resetForm();
        const {email, did, id} = await createUser({...values, public_key: toHexString(publicKey)});
        console.log(email, did, id)
        window.electron.store.set('publicKey', toHexString(publicKey))
        window.electron.store.set('privateKey', toHexString(secretKey))
        window.electron.store.set('mnemonic', mnemonic)
        window.electron.store.set('did', did)
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