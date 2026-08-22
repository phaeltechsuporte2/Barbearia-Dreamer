export const ADMIN_EMAILS = [
  "comercial.barbeariadreamer@gmail.com",
  "phael.techsuporte2@gmail.com",
  "phael.techsuporte@gmail.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
