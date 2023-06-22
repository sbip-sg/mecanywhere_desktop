import React from 'react';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';

const TextFieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextField = {
    fullWidth: true,
    variant: 'outlined',
    margin: "dense",
    autoComplete: "off",
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return <TextField {...configTextField} />;
};

export default TextFieldWrapper;
