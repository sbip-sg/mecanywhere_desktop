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
  
  export default function HostRegistration() {
    const formikPublicKey = useFormik({
      initialValues: {
        publicKey: "",
      },
      validationSchema: validationSchemaPublicKey,
      onSubmit: (values, formActions) => {
        actions.setHostPublicKey(formikPublicKey.values.publicKey);
        formikDID.setFieldValue("DID", formikPublicKey.values.publicKey);
        // formActions.resetForm();
        console.log(store.getState().host.publicKey);
      },
    });
  
    const formikDID = useFormik({
      initialValues: {
        DID: "",
      },
      validationSchema: validationSchemaDID,
      onSubmit: (values, formActions) => {
        actions.setHostDID(formikDID.values.DID);
        // formActions.resetForm();
        console.log(store.getState().host.DID);
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
              <Typography fontSize="24px">Register Host</Typography>
            </Box>
            <form onSubmit={formikPublicKey.handleSubmit}>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
               
              </Box>
              <Box sx={{ height: "3rem" }}>
                <TextField
                  sx={{ height: "3rem" }}
                  id="publicKey"
                  name="publicKey"
                  label="Host Public Key"
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
                  id="hostDID"
                  name="DID"
                  label="Host DID"
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
            <Typography fontSize="14px">Host Verifiable Credential</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography fontSize="18px">
              {useSelector((state) => state.host.DID)}
            </Typography>
          </Box>

        </Grid>
        <Grid item xs={3} />
      </Grid>
    );
  }