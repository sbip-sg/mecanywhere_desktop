import * as Yup from 'yup';

const ActivateFormSchema = (minStake: number) =>
  Yup.object({
    stake: Yup.number()
      .required('Stake required!')
      .min(minStake, `Stake must be more than the minimum of ${minStake}!`)
      .max(1000000, 'Stake too high!'),
    blockTimeoutLimit: Yup.number()
      .required('Block timeout limit required!')
      .min(1, 'Block timeout limit too low!')
      .max(1000000, 'Block timeout limit too high!'),
  });

export default ActivateFormSchema;
