export type AdminNavItem = {
  label: string;
  path: string;
};

export type LoginResult = { success: true } | { success: false; error: string };
