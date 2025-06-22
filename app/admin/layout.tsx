import AdminNavbar from './components/AdminNavbar';
import Footer2 from './components/FooterAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed navbar */}
      <AdminNavbar />
      
      {/* Content area that grows and pushes footer down */}
      <div className="flex-1 flex flex-col ml-12">
        {/* Scrollable content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
        
        {/* Footer that stays at bottom */}
        <Footer2 />
      </div>
    </div>
  );
}