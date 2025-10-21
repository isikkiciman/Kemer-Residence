import { Link } from "@/i18n/routing";

export default function BlogDetailPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Blog Detay</h1>
        <p className="text-gray-600">Blog detay sayfası yakında güncellenecek...</p>
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← Blog listesine dön
        </Link>
      </div>
    </div>
  );
}
