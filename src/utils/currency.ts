
/**
 * Format a numeric value as currency
 * @param value - The numeric value to format
 * @param currency - The currency code (USD, EUR, INR, etc)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string = "USD"): string => {
  const formatter = new Intl.NumberFormat(getCurrencyLocale(currency), {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(value);
};

/**
 * Format a numeric value as INR (Indian Rupees)
 * @param value - The numeric value to format
 * @returns Formatted INR string
 */
export const formatINR = (value: number): string => {
  return formatCurrency(value, "INR");
};

/**
 * Get the appropriate locale for a currency
 */
const getCurrencyLocale = (currency: string): string => {
  switch (currency) {
    case "USD":
      return "en-US";
    case "EUR":
      return "de-DE";
    case "GBP":
      return "en-GB";
    case "JPY":
      return "ja-JP";
    case "INR":
      return "en-IN";
    default:
      return "en-US";
  }
};

/**
 * Convert between currencies
 * @param value - The numeric value to convert
 * @param fromCurrency - The source currency code
 * @param toCurrency - The target currency code
 * @returns Converted value
 */
export const convertCurrency = (
  value: number, 
  fromCurrency: string = "USD", 
  toCurrency: string = "USD"
): number => {
  // This would typically call an exchange rate API
  // For now, we'll use hardcoded approximate rates
  const rates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.92,
      GBP: 0.79,
      JPY: 110.0,
      INR: 83.0,
      USD: 1.0,
    },
    EUR: {
      USD: 1.09,
      GBP: 0.86,
      JPY: 120.0,
      INR: 90.11,
      EUR: 1.0,
    },
    GBP: {
      USD: 1.27,
      EUR: 1.16,
      JPY: 140.0,
      INR: 105.2,
      GBP: 1.0,
    },
    JPY: {
      USD: 0.009,
      EUR: 0.008,
      GBP: 0.007,
      INR: 0.75,
      JPY: 1.0,
    },
    INR: {
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      JPY: 1.33,
      INR: 1.0,
    }
  };
  
  // Get the conversion rate
  const rate = rates[fromCurrency]?.[toCurrency] || 1.0;
  
  // Apply the conversion
  return value * rate;
};

/**
 * Convert USD to INR
 * @param value - The USD value to convert to INR
 * @returns Value in INR
 */
export const convertToINR = (value: number): number => {
  return convertCurrency(value, "USD", "INR");
};
