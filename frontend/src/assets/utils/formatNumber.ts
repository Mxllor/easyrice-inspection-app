export const formatNumber = (num: number) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
export const formatPercentage = (num: number) => num.toFixed(2);