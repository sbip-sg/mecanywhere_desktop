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

export default function ClientJobSubmission() {
  const [filename, setFilename] = useState("");

  const handleFileUpload = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    setFilename(name);
  };
 
  return (
    <Grid container spacing={3} sx={{ margin: "0 0 2rem 0" }}>
        <Grid item xs={3}/>
      <Grid item xs={6}>

       
        {/* <Divider sx={{margin:"1rem 0 1rem 0", borderBottomWidth: 1.5}}/> */}
        <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              marginBottom: "0.5rem",
            }}
          >
            <Typography fontSize="24px">Submit Jobs</Typography>
          </Box>
        <Grid
          item
          container
          sx={{
            margin: "1rem 0 1rem 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={6}>
            <Button variant="contained" component="label" sx={{backgroundColor: "purple"}}>
              Upload File
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Typography fontSize="14px" sx={{fontStyle: 'italic'}}>{filename}</Typography>
          </Grid>
        </Grid>
          <Button fullWidth variant="contained" component="label" sx={{backgroundColor: "purple"}}>
            Submit Task
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
      </Grid>
      <Grid item xs={3} />
    </Grid>
  );
}