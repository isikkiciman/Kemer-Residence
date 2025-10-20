"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hotel,
  FileText,
  Image as ImageIcon,
  Settings,
  Languages,
  LogOut,
  Home,
} from "lucide-react";

const menuItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/rooms",
    label: "Odalar",
    icon: Hotel,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: FileText,
  },
  {
    href: "/admin/gallery",
    label: "Galeri",
    icon: ImageIcon,
  },
  {
    href: "/admin/settings",
    label: "Site Ayarları",
    icon: Settings,
  },
  {
    href: "/admin/translations",
    label: "Çeviriler",
    icon: Languages,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white border-r border-gray-200 w-64 flex-shrink-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Hotel className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Romee Hotel</h1>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} className={isActive ? "text-blue-700" : "text-gray-500"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-200 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Home size={18} className="text-gray-500" />
          <span>Siteye Git</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
