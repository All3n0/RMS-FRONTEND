import React from 'react';
import { Home, FileText, CreditCard, User, Phone } from 'lucide-react';

const TenantFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">RentPro</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your tenant portal for easy living
            </p>
          </div>

          {/* Tenant Links */}
          <div>
            <h3 className="text-md font-semibold mb-4 text-blue-400">Tenant</h3>
            <ul className="space-y-2">
              {['Dashboard', 'Leases', 'Payments', 'Maintenance'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-md font-semibold mb-4 text-blue-400">Resources</h3>
            <ul className="space-y-2">
              {['Rental Guide', 'FAQ', 'Community Rules', 'Moving Tips'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-md font-semibold mb-4 text-blue-400">Contact</h3>
            <ul className="space-y-2">
              {['Emergency', 'Maintenance', 'Landlord', 'Support'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-400 mb-2 md:mb-0">
              © 2024 RentPro Technologies Inc.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TenantFooter;