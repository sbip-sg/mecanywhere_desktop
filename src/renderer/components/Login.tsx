import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import TextFieldWrapper from '../utils/TextField';
import FormSchema from '../utils/FormSchema';
import { createChallenge, verifyResponse } from '../services/RegistrationServices';
import actions from "./states/actionCreators";
import { reduxStore } from "./states/store";
import signMessage from "../utils/signMessage"
import { useNavigate } from 'react-router-dom';

var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

const Login = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (values, formActions) => {
        formActions.resetForm();
        if (window.electron.store.get('did')) {
            actions.setDID(window.electron.store.get('did'));
        } else {
            throw new Error("DID not found")
        }
        const challenge = await createChallenge({...values, did: reduxStore.getState().accountUser.did});
        const signedChallenge = signMessage(window.electron.store.get('privateKey-wallet'), challenge);
        // for testing wrong private key
        // const signedChallenge = signMessage("c4b12726bd9dae6a29c0c5cd43658cd8fb1d2c7418652d20ce372384dda73b347dfa0ac7febc06dacb656dda382804e855782ece48e8aa9062c7ddfdd4106f2", challenge);
        const res = await verifyResponse({did: reduxStore.getState().accountUser.did, signedChallenge: signedChallenge, challenge: challenge});
        if (res === true) {
            console.log("User authenticated")
            actions.setAuthenticated(true);
            navigate("/userjobsubmission")
        } else {
            console.log("User not authenticated")
            setError("Authentication failed. Please check your credentials.");
        }
    }

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={FormSchema}
            onSubmit={(values, formActions) => {
                handleSubmit(values, formActions);
            }}>
            {({ errors, touched }) => (
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
                                error={errors.email && touched.email}
                                helperText={errors.email && touched.email && errors.email}
                            />
                            <TextFieldWrapper
                                margin="dense"
                                name="password"
                                placeholder="Enter password"
                                autoComplete="off"
                                label="Password"
                                type="password"
                                error={errors.password && touched.password}
                                helperText={errors.password && touched.password && errors.password}
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