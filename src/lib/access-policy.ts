export function safeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\r\n]/.test(value)) return "/dashboard";
  const pathname = value.split(/[?#]/)[0];
  return ["/dashboard", "/account", "/testing", "/join", "/owner-setup", "/install"].includes(pathname) ? value : "/dashboard";
}