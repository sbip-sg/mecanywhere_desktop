import * as Yup from 'yup';

export const LoginFormSchema = Yup.object({
  password: Yup.string()
    .required('Password required!')
    .min(6, 'Password too short!')
    .max(20, 'Password too long!'),
});

export const RegisterFormSchema = Yup.object({
  password: Yup.string()
    .required('Password required!')
    .min(6, 'Password too short!')
    .max(20, 'Password too long!'),
});

export const PaymentFormSchema = (balance: number) =>
  Yup.object({
    amount: Yup.number()
      .required('Amount is required!')
      .positive('Amount must be a positive number!')
      .typeError('Please enter a valid amount.')
      .test(
        'is-within-balance',
        'Amount exceeds available balance',
        (value) => value <= balance
      ),
  });

export const WithdrawalFormSchema = (balance: number) =>
  Yup.object({
    amount: Yup.number()
      .required('Amount is required!')
      .positive('Amount must be a positive number!')
      .typeError('Please enter a valid amount.')
      .test(
        'is-within-balance',
        'Amount exceeds available balance',
        (value) => value <= balance
      ),
  });
