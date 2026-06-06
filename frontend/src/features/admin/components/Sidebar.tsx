import { FolderOpen, FileText, Image, Tag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

type SidebarNavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Posts",
    path: "/admin/posts",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    label: "Images",
    path: "/admin/images",
    icon: <Image className="h-4 w-4" />,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: <FolderOpen className="h-4 w-4" />,
  },
  { label: "Tags", path: "/admin/tags", icon: <Tag className="h-4 w-4" /> },
];

type SidebarProps = {
  onNavClick?: () => void;
};

export function Sidebar({ onNavClick }: SidebarProps) {
  return (
    <aside className="flex h-full w-56 flex-col bg-white border-r border-foreground/10">
      <div className="border-b border-foreground/10 px-5 py-4">
        <span className="font-serif text-lg font-semibold text-foreground">
          Naturo Estela
        </span>
        <p className="mt-0.5 text-xs text-taupe">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul role="list" className="space-y-1">
          {NAV_ITEMS.map(({ label, path, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={onNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-forest-green/10 text-forest-green"
                      : "text-taupe hover:bg-foreground/5 hover:text-foreground",
                  )
                }
              >
                {icon}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
