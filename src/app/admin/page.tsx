import { Hotel, FileText, Image as ImageIcon, Languages, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { title: "Odalar", value: "0", icon: Hotel, href: "/admin/rooms" },
    { title: "Blog", value: "0", icon: FileText, href: "/admin/blog" },
    { title: "Galeri", value: "0", icon: ImageIcon, href: "/admin/gallery" },
    { title: "Çeviriler", value: "580", icon: Languages, href: "/admin/translations" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Hoş geldiniz</p>
      </div>

      {/* Stats - Minimal Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <Icon className="text-gray-600 group-hover:text-blue-600 transition-colors" size={20} />
                </div>
                <ArrowUpRight className="text-gray-300 group-hover:text-blue-500 transition-colors" size={16} />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-semibold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.title}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions - Clean List */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-700">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/admin/rooms"
            className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Hotel className="text-blue-600" size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Yeni Oda Ekle</div>
                <div className="text-xs text-gray-500">Oda yönetimi</div>
              </div>
            </div>
            <ArrowUpRight className="text-gray-300 group-hover:text-blue-500 transition-colors" size={16} />
          </Link>

          <Link
            href="/admin/blog"
            className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="text-green-600" size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Yeni Blog Yazısı</div>
                <div className="text-xs text-gray-500">Blog yönetimi</div>
              </div>
            </div>
            <ArrowUpRight className="text-gray-300 group-hover:text-green-500 transition-colors" size={16} />
          </Link>

          <Link
            href="/admin/settings"
            className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <ImageIcon className="text-purple-600" size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Site Ayarları</div>
                <div className="text-xs text-gray-500">Logo, Banner değiştir</div>
              </div>
            </div>
            <ArrowUpRight className="text-gray-300 group-hover:text-purple-500 transition-colors" size={16} />
          </Link>

          <Link
            href="/admin/translations"
            className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Languages className="text-orange-600" size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Çeviriler</div>
                <div className="text-xs text-gray-500">5 dil yönetimi</div>
              </div>
            </div>
            <ArrowUpRight className="text-gray-300 group-hover:text-orange-500 transition-colors" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
