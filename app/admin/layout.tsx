// app/admin/layout.tsx
import AdminNavbar from './components/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminNavbar />
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
