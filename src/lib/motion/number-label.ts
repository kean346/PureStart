export function numericLabel(text: string) {
  const match = text.match(/^([+−-]?(?:[R$€£]\s*)?)(\d[\d,]*(?:\.\d+)?)([%kKmMbB]?)$/);
  if (!match) return null;
  const value = Number(match[2].replaceAll(",", ""));
  if (!Number.isFinite(value)) return null;
  const decimals = match[2].split(".")[1]?.length ?? 0;
  const format = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: match[2].includes(","),
  });
  return (progress: number) => (progress >= 1 ? text : `${match[1]}${format.format(value * progress)}${match[3]}`);
}
