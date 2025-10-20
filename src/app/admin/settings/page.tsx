"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Save, Upload } from "lucide-react";
import toast from "react-hot-toast";

const languages = [
  { code: "tr", name: "TR" },
  { code: "en", name: "EN" },
  { code: "de", name: "DE" },
  { code: "ru", name: "RU" },
  { code: "pl", name: "PL" },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [settings, setSettings] = useState({
    siteName: { tr: "", en: "", de: "", ru: "", pl: "" },
    siteDescription: { tr: "", en: "", de: "", ru: "", pl: "" },
    logoUrl: "",
    bannerUrl: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: { tr: "", en: "", de: "", ru: "", pl: "" },
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      
      setSettings({
        siteName: data.siteName || { tr: "", en: "", de: "", ru: "", pl: "" },
        siteDescription: data.siteDescription || { tr: "", en: "", de: "", ru: "", pl: "" },
        logoUrl: data.logoUrl || "/logo.svg",
        bannerUrl: data.bannerUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        contactAddress: data.contactAddress || { tr: "", en: "", de: "", ru: "", pl: "" },
        socialFacebook: data.socialFacebook || "",
        socialInstagram: data.socialInstagram || "",
        socialTwitter: data.socialTwitter || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Ayarlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece SVG, PNG, JPG ve WebP!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Maksimum 5MB!');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setSettings({ ...settings, logoUrl: data.url });
      toast.success('Logo yüklendi!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hata oluştu!');
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece PNG, JPG ve WebP!');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Maksimum 10MB!');
      return;
    }

    setUploadingBanner(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setSettings({ ...settings, bannerUrl: data.url });
      toast.success('Banner yüklendi!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hata oluştu!');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Ayarlar kaydedildi!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Site Ayarları</h1>
        <p className="text-sm text-gray-500 mt-1">Logo, banner ve genel ayarlar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo & Banner */}
        <div className="grid grid-cols-2 gap-6">
          {/* Logo */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Logo</label>
            <label className="cursor-pointer block">
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-1" size={24} />
                    <p className="text-xs text-gray-500">Logo yükle</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <input
              type="text"
              value={settings.logoUrl}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              placeholder="veya URL girin"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Banner */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Banner</label>
            <label className="cursor-pointer block">
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50/30 transition-all overflow-hidden">
                {settings.bannerUrl ? (
                  <img src={settings.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-1" size={24} />
                    <p className="text-xs text-gray-500">Banner yükle</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleBannerUpload}
                disabled={uploadingBanner}
                className="hidden"
              />
            </label>
            <input
              type="text"
              value={settings.bannerUrl}
              onChange={(e) => setSettings({ ...settings, bannerUrl: e.target.value })}
              placeholder="veya URL girin"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Site Name */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Site İsmi</label>
          <div className="grid grid-cols-5 gap-3">
            {languages.map((lang) => (
              <input
                key={lang.code}
                type="text"
                value={settings.siteName[lang.code as keyof typeof settings.siteName]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    siteName: { ...settings.siteName, [lang.code]: e.target.value },
                  })
                }
                placeholder={lang.name}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>
        </div>

        {/* Site Description */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Site Açıklaması</label>
          <div className="space-y-2">
            {languages.map((lang) => (
              <textarea
                key={lang.code}
                rows={2}
                value={settings.siteDescription[lang.code as keyof typeof settings.siteDescription]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    siteDescription: {
                      ...settings.siteDescription,
                      [lang.code]: e.target.value,
                    },
                  })
                }
                placeholder={`${lang.name} açıklama`}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">E-posta</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              placeholder="info@kemerresidence.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Telefon</label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              placeholder="+90 212 XXX XX XX"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Facebook</label>
            <input
              type="url"
              value={settings.socialFacebook}
              onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
              placeholder="facebook.com/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Instagram</label>
            <input
              type="url"
              value={settings.socialInstagram}
              onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
              placeholder="instagram.com/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Twitter</label>
            <input
              type="url"
              value={settings.socialTwitter}
              onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
              placeholder="twitter.com/..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
