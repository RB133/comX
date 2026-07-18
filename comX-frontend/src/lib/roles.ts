export type Role = "OWNER" | "ADMIN" | "MEMBER" | "QUEUE" | "BANNED";

/** OWNER and ADMIN share admin-level community permissions. */
export function isAdminRole(role: Role): boolean {
  return role === "ADMIN" || role === "OWNER";
}
