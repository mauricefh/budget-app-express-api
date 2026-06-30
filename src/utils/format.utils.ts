export function formatCurrencyForDisplay(
  amount: number,
  local: string = "en-CA",
  currency: string = "CAD",
): string {
  return new Intl.NumberFormat(local, {
    style: "currency",
    currency: currency,
  }).format(amount / 100);
}
