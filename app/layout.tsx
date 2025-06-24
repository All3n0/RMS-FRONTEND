import './globals.css';
import type { Metadata } from 'next';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-phone-input-2/lib/style.css';



export const metadata: Metadata = {
  title: 'Remy - Property Management',
  description: 'Manage your properties with ease',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="corporate">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}