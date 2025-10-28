import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "../globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel - Kemer Residence",
  description: "Hotel Management System",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <Script id="gtm-base-admin" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MMCK759H');`}
        </Script>
      </head>
      <body className={inter.className}>
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-MMCK759H\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe>",
          }}
        />
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="max-w-7xl mx-auto px-6 py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
