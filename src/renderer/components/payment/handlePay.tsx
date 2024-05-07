const handlePay = async (
  provider: any,
  senderAddress: string,
  contractAddress: string,
  amount: number
) => {
  try {
    console.log('Payment successful.');
  } catch (error) {
    console.error('Payment error', error);
  }
};

export default handlePay;
