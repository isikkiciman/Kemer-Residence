// CSS Module declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Global CSS declarations
declare module '../app/globals.css';
declare module './globals.css';

// Component declarations
declare module '@/components/Hero';
declare module '@/components/FeaturedRooms';
declare module '@/components/Features';
declare module '@/components/LatestBlog';
declare module '@/components/CTASection';
declare module '@/components/Header';
declare module '@/components/Footer';
declare module '@/components/admin/AdminHeader';
declare module '@/components/admin/AdminSidebar';
