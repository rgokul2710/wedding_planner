export interface Currency {
  code: string
  symbol: string
  label: string
}

export const CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham (د.إ)' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar (S$)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)' },
]

export const DEFAULT_CURRENCY = 'INR'
