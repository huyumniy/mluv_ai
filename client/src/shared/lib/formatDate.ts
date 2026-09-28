export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}