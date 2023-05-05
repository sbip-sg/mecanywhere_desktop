import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import TextFieldWrapper from '../utils/TextField';
import FormSchema from '../utils/FormSchema';
import { createChallenge, verifyResponse } from '../services/TestServices';
import actions from "./states/actionCreators";
import { store } from "./states/store";
import { useSelector } from "react-redux";
import RSASign from "../utils/RSASign"
import {toByteArray} from "../utils/generateKeyPairAndMnemonics"
import { useNavigate } from 'react-router-dom';

var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

const Login = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (values, formActions) => {
        formActions.resetForm();
        // console.log(window.electron.store.get('publicKey'))
        // const publicKey = window.electron.store.get('publicKey')
        // console.log("publicKey", publicKey)
        // console.log("publicKey", nacl.util.decodeUTF8(publicKey))
        // console.log(window.electron.store.get('mnemonic'))
        // console.log(window.electron.store.get('did'))
        // window.electron.ipcRenderer.sendMessage('retrieveKey', "");
        if (window.electron.store.get('did')) {
            // console.log(window.electron.store.get('did'))
            actions.setUserDID(window.electron.store.get('did'));
            // console.log("DID RETRIEVED", store.getState().user.DID)
        } else {
            throw new Error("DID not found")
        }
        const {did, challenge} = await createChallenge({did: store.getState().user.DID});
        // console.log(challenge);
        if (challenge && window.electron.store.get('privateKey')) {
            // const msgStr = "My unencrypted message";
            // const msg = nacl.util.decodeUTF8(challenge);
            // const signazzture = nacl.sign.detached(msg, toByteArray(window.electron.store.get('privateKey')));
            // const signatureB64 = nacl.util.encodeBase64(signature);
            // console.log("msg", toByteArray(window.electron.store.get('privateKey')))
            // console.log("private key", window.electron.store.get('privateKey'))
            // console.log("signature", signature)
            // console.log("signatureB64", signatureB64);
            // const verifiedMsg = nacl.sign.open(signature, toByteArray(publicKey));
            // console.log("verifiedMsg", verifiedMsg)
            // console.log("nacl.util.encodeUTF8(verifiedMsg)", nacl.util.encodeUTF8(verifiedMsg));


            // console.log("privateKEY RETRaIEVED")
            const signedChallenge = RSASign(window.electron.store.get('privateKey'), challenge);
            // console.log("signedChallenge", signedChallenge);
            // let decrypted = nacl.sign.open(nacl.util.decodeBase64(signedChallenge), nacl.util.decodeUTF8(publicKey)) // is this right? -> Yes
            // console.log(nacl.util.encodeUTF8(decrypted)) 
            const res = await verifyResponse({did: store.getState().user.DID, signedChallenge: signedChallenge, challenge: challenge});
            console.log(res)
            console.log(store.getState().user.authenticated)
            if (res === true) {
                console.log("inside")
                actions.setUserAuthenticated(true);
                console.log(store.getState().user.authenticated)
                
                navigate("/clientjobsubmission")
            }
        }
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
                                LOG IN
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
                                <Button variant="contained" color="secondary" type="submit">Log In</Button>
                                <Button variant="contained" color="secondary" onClick={() => navigate("/register")}>Create Account</Button>
                            </Stack>
                        </Box>
                    </Container>

                </Form>

            )}
        </Formik>
    );
}

export default Login;