// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import {
//   Typography,
//   Stack,
//   Grid,
//   Paper,
//   TextField,
//   Button,
//   Box,
// } from '@mui/material';
// import React, { useState } from 'react';
// import * as Yup from 'yup';
// import { useFormik, Formik, FormikProvider } from 'formik';
// import TextFieldWrapper from './components/utils/TextField';
// import actions from "./components/states/actionCreators"
// import { store } from "./components/states/store"
// import { useSelector } from 'react-redux'


// const validationSchemaPublicKey = Yup.object().shape({
//   publicKey: Yup.string()
//     .min(7, 'Public key must be at least 7 characters')
//     .required('Public key is required'),
// });

// const validationSchemaDID = Yup.object().shape({
//   DID: Yup.string()
//   .min(7, 'DID must be at least 7 characters')
//   .required('DID is required'),
// });

// function Hello() {
//   const formikPropsPublicKey = useFormik({
//     initialValues: { publicKey: '' },
//     validationSchema: {validationSchemaPublicKey},
//     onSubmit: (values, formActions) => {
//       const vals = { ...values };
//       actions.setUserPublicKey(vals.publicKey);
//       console.log('Created DID, values:', vals);
//       // console.log('Created DID, values2:', store.getState().user.publicKey);
//       // formActions.resetForm();
//     }
//   })
//   return (
//     <Grid container spacing={3}>
//       <Grid item xs={6}>
//         {/* <Formik
//           initialValues={{ publicKey: '' }}
//           validationSchema={validationSchemaPublicKey}
//           onSubmit={(values, formActions) => {
//             const vals = { ...values };
//             actions.setUserPublicKey(vals.publicKey);
//             console.log('Created DID, values:', vals);
//             console.log('Created DID, values2:', store.getState().user.publicKey);
//             formActions.resetForm();
//           }}
//         >
//           {() => ( */}
//             <form>
//               <Stack
//                 sx={{ pt: 4 }}
//                 direction="column"
//                 spacing={2}
//                 justifyContent="center"
//               >
//                 <TextFieldWrapper
//                   name="publicKey"
//                   placeholder="End-user Public Key"
//                   value={formikPropsPublicKey.values.number}
//                   // onChange={formikPropsPublicKey.handleChange}
//                   label="End-user Public Key"
//                   autoComplete="off"
//                   margin="dense"
//                 />
//                 <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       ':hover': {
//                         bgcolor: 'black',
//                         color: 'white',
//                       },
//                       bgcolor: 'black',
//                       alignSelf: 'right',
//                     }}
//                     type="submit"
//                   >
//                     Create DID
//                   </Button>
//                 </Box>
//               </Stack>
//             </form>
//           {/* )}
//         </Formik> */}
//         {/* <Formik
//           initialValues={{ DID: '' }}
//           validationSchema={validationSchemaDID}
//           onSubmit={(values, formActions) => {
//             const vals = { ...values };
//             // setVC(vals.DID)
//             console.log('Created VC, values:', vals);
//             formActions.resetForm();
//           }}
//         >
//           {( {values, setFieldValue} ) => (
//             <Form>
//               <Stack
//                 sx={{ pt: 4 }}
//                 direction="column"
//                 spacing={2}
//                 justifyContent="center"
//               >
//                 <TextFieldWrapper
//                   name="DID"
//                   placeholder="End-user DID"
//                   label="End-user DID"
//                   autoComplete="off"
//                   margin="dense"
//                   onChange={(e) => { someFunctionWithLogic(value, setFieldValue ); }}
//                 />
//                 <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       ':hover': {
//                         bgcolor: 'black',
//                         color: 'white',
//                       },
//                       bgcolor: 'black',
//                       alignSelf: 'right',
//                     }}
//                     type="submit"
//                   >
//                     Create VC
//                   </Button>
//                 </Box>
//               </Stack>
//             </Form>
//           )}
//         </Formik> */}
//         {/* {VC ? VC : ""} */}
//       </Grid>
//       <Grid item xs={6}>
//         right side
//       </Grid>
//     </Grid>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Hello />} />
//       </Routes>
//     </Router>
//   );
// }
