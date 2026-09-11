const formatter = new Intl.NumberFormat('en-NZ', {
  style: 'currency',
  currency: 'NZD',
});

export const formatNZD = (amount) => formatter.format(amount);
