const privateDestinations = ["/dashboard", "/autonomy", "/account", "/testing", "/join", "/owner-setup"] as const;
export type PrivateDestination = typeof privateDestinations[number];
export function safeReturnTo(value: unknown): PrivateDestination {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\r\n]/.test(value)) return "/dashboard";
  const pathname = value.split(/[?#]/)[0];
  return privateDestinations.find(destination => destination === pathname) ?? "/dashboard";
}