export const formatCurrency = (value: number | null | undefined, currency: string = 'usd'): string => {
  const symbols: { [key: string]: string } = {
    usd: '$', eur: '€', gbp: '£', jpy: '¥', inr: '₹'
  };
  const symbol = symbols[currency] || '$';
  
  if (value == null || isNaN(value)) return `${symbol}--`;
  if (value >= 1e12) return `${symbol}${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${symbol}${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${symbol}${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${symbol}${(value / 1e3).toFixed(2)}K`;
  if (value >= 1) return `${symbol}${value.toFixed(2)}`;
  return `${symbol}${value.toFixed(6)}`;
};

export const formatPercentage = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return '--';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const getCoinColor = (change: number | null | undefined): string => {
  if (change == null || isNaN(change)) return '#9E9E9E';
  if (change > 0) return '#00C853';
  if (change < 0) return '#FF5252';
  return '#9E9E9E';
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    usd: '$', eur: '€', gbp: '£', jpy: '¥', inr: '₹'
  };
  return symbols[currency] || '$';
};

export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return '--';
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
};
