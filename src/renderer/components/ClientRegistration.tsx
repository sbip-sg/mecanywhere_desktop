import {
    Typography,
    Stack,
    Grid,
    TextField,
    Button,
    Box,
    Divider,
  } from "@mui/material";
  import { useState } from "react";
  import * as Yup from "yup";
  import { useFormik, Formik, FormikProvider } from "formik";
  import actions from "./states/actionCreators";
  import { store } from "./states/store";
  import { useSelector } from "react-redux";
  import { createDID } from "./utils/createDID";
  import {createVerifiableCredential} from "./utils/createVC";
  
  const validationSchemaPublicKey = Yup.object().shape({
    publicKey: Yup.string()
      .min(7, "Public key must be at least 7 characters")
      .required("Public key is required"),
  });
  
  const validationSchemaDID = Yup.object().shape({
    DID: Yup.string()
      .min(7, "DID must be at least 7 characters")
      .required("DID is required"),
  });
  
  export default function ClientRegistration() {
    const formikPublicKey = useFormik({
      initialValues: {
        publicKey: "",
      },
      validationSchema: validationSchemaPublicKey,
      onSubmit: (values, formActions) => {
        actions.setUserPublicKey(formikPublicKey.values.publicKey);
        const DID = createDID(formikPublicKey.values.publicKey)
        console.log(DID)
        formikDID.setFieldValue("DID", DID);
        // formActions.resetForm();
        // fetch('/create-did', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ public_key: formikPublicKey.values.publicKey })
        //   })
        //   .then(response => response.json())
        //   .then(data => {
        //     actions.setUserDID(data.did);
        //     formikDID.setFieldValue("DID", data.did);
        //     console.log("DID:", data.did);
        //   })
        //   .catch(error => console.error(error));
        console.log(store.getState().user.publicKey);
      },
    });
  
    const formikDID = useFormik({
      initialValues: {
        DID: "",
      },
      validationSchema: validationSchemaDID,
      onSubmit: (values, formActions) => {
        const VC = createVerifiableCredential(formikDID.values.DID)
        console.log(VC)
        actions.setUserDID(VC);
        // formActions.resetForm();
        console.log(store.getState().user.DID);
      },
    });
  
    return (
      <Grid container spacing={3} sx={{ margin: "0 0 0.5rem 0" }}>
          <Grid item xs={3}/>
        <Grid item xs={6}>
          <Stack direction="column">
            <Box
              sx={{
                display: "flex",
                justifyContent: "left",
                marginBottom: "0.5rem",
              }}
            >
              <Typography fontSize="24px">Register Client</Typography>
            </Box>
            <form onSubmit={formikPublicKey.handleSubmit}>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
                {/* <Typography fontSize="14px">
                User Public Key
              </Typography> */}
              </Box>
              <Box sx={{ height: "3rem" }}>
                <TextField
                  sx={{ height: "3rem" }}
                  id="publicKey"
                  name="publicKey"
                  label="User Public Key"
                  type="text"
                  fullWidth
                  value={formikPublicKey.values.publicKey}
                  onChange={formikPublicKey.handleChange}
                  onBlur={formikPublicKey.handleBlur}
                  error={
                    formikPublicKey.touched.publicKey &&
                    Boolean(formikPublicKey.errors.publicKey)
                  }
                  helperText={
                    formikPublicKey.touched.publicKey &&
                    formikPublicKey.errors.publicKey
                  }
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "2rem",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ minWidth: "10rem", width: "30%" }}
                >
                  Create DID
                </Button>
              </Box>
            </form>
            <form onSubmit={formikDID.handleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  marginTop: "1rem",
                }}
              >
              </Box>
              <Box sx={{ height: "3rem" }}>
                <TextField
                  sx={{ height: "3rem" }}
                  fullWidth
                  id="userDID"
                  name="DID"
                  label="User DID"
                  onChange={formikDID.handleChange}
                  value={formikDID.values.DID}
                  error={formikDID.touched.DID && Boolean(formikDID.errors.DID)}
                  helperText={formikDID.touched.DID && formikDID.errors.DID}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "2rem",
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ minWidth: "10rem", width: "30%" }}
                >
                  Create VC
                </Button>
              </Box>
            </form>
          </Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Typography fontSize="14px">User Verifiable Credential</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center"}}>
            <Typography fontSize="10px">
              {JSON.stringify(useSelector((state) => state.user.DID))}
            </Typography>
          </Box>

        </Grid>
        <Grid item xs={3} />
      </Grid>
    );
  }