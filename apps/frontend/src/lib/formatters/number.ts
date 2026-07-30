export function formatNumber(
  value: number,
  decimals = 2,
): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(
  value: number,
  decimals = 1,
): string {
  return `${formatNumber(value, decimals)}%`;
}
