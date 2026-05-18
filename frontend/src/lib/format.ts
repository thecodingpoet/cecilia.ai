const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(amount: number): string {
  return currency.format(amount);
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const diffMs = d.getTime() - Date.now();
  const absSec = Math.abs(diffMs) / 1000;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), "second");
  if (absSec < 3600) return rtf.format(Math.round(diffMs / 60000), "minute");
  if (absSec < 86400) return rtf.format(Math.round(diffMs / 3600000), "hour");
  if (absSec < 604800) return rtf.format(Math.round(diffMs / 86400000), "day");
  return formatDateTime(iso);
}
