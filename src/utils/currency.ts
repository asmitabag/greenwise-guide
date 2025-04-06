
// Exchange rate from USD to INR (this would ideally be fetched from an API)
const USD_TO_INR_RATE = 83.5;

export const convertToINR = (usdAmount: number): number => {
  return usdAmount * USD_TO_INR_RATE;
};

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
