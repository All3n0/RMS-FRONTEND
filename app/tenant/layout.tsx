import TenantNavbar from './components/TenantNavbar';
import TenantFooter from './components/TenantFooter';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed navbar at the top */}
      <TenantNavbar />
      
      {/* Main content area that grows and pushes footer down */}
      <div className="flex-1 flex flex-col">
        {/* Scrollable content area with padding */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
        
        {/* Footer that stays at the bottom */}
        <TenantFooter />
      </div>
    </div>
  );
}