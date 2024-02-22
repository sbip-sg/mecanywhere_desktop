import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useField } from 'formik';

interface TextFieldWrapperProps
  extends Omit<TextFieldProps, 'name' | 'value' | 'onChange'> {
  name: string;
}

const TextFieldWrapper: React.FC<TextFieldWrapperProps> = ({
  name,
  ...otherProps
}) => {
  const [field, meta] = useField(name);

  const configTextField: TextFieldProps = {
    ...field,
    fullWidth: true,
    variant: 'outlined',
    margin: 'dense',
    autoComplete: 'off',
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return <TextField {...configTextField} />;
};

export default TextFieldWrapper;
