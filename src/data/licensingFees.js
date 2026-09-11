import { formatNZD } from '../utils/formatNZD.js';

export const FEE_DATA = {
  food: {
    year: '2026/27',
    levy: {
      label: 'Food Business Levy', amount: 99.19,
      get display() { return formatNZD(this.amount); },
      period: 'incl. GST per year',
    },
    collectionFee: {
      label: 'Levy collection fee', amount: 12.65,
      get display() { return `${this.maximum ? 'Up to ' : ''}${formatNZD(this.amount)}`; },
      period: 'incl. GST', maximum: true,
    },
    registration: { label: 'Council registration', variable: true, display: 'Varies' },
    verification: { label: 'Verification', variable: true, display: 'Separate charge' },
    note: 'The Food Business Levy is separate from council registration and verification costs. Your total cost may therefore be higher than the known levy amounts.',
  },
  alcohol: {
    year: 'Current schedule',
    riskLevels: {
      veryLow: { label: 'Very low', score: '0–2', application: 368.0, annual: 161.0 },
      low: { label: 'Low', score: '3–5', application: 609.5, annual: 391.0 },
      medium: { label: 'Medium', score: '6–15', application: 816.5, annual: 632.5 },
      high: { label: 'High', score: '16–25', application: 1023.5, annual: 1035.0 },
      veryHigh: { label: 'Very high', score: '26+', application: 1207.5, annual: 1437.5 },
    },
    note: 'Amounts include GST. Application and annual fees depend on the premises cost/risk rating. Special licences use a different fee structure.',
  },
  outdoor: {
    year: '2026/27',
    application: { label: 'Application fee', variable: true, display: 'Current council rate' },
    rental: { label: 'Public-space rental', variable: true, display: 'Varies' },
    note: 'Outdoor dining costs can depend on the location, size and type of council-managed public space occupied. Do not invent a fixed 2026/27 amount.',
  },
};
