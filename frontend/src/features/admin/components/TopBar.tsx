import { LogOut, Menu } from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";

type TopBarProps = {
  title: string;
  onMenuToggle: () => void;
};

export function TopBar({ title, onMenuToggle }: TopBarProps) {
  const { logout } = useAdminAuth();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-foreground/10 bg-white px-4">
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-md p-1.5 text-taupe hover:bg-foreground/5 md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="flex-1 font-medium text-foreground">{title}</h1>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-taupe hover:bg-foreground/5 hover:text-foreground"
        aria-label="Sign out"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </header>
  );
}
