import React from 'react';
import { Building2, Shield, Clock, Users, Award } from 'lucide-react';

const Footer2 = () => {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">RentPro</span>
            </div>
            <p className="text-gray-300 text-sm">
              Complete property management solution
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold mb-4 text-blue-400">Platform</h3>
            <ul className="space-y-2">
              {['Dashboard', 'Properties', 'Tenants', 'Payments'].map((link) => (
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
              {['Help Center', 'Tutorials', 'API Docs', 'Support'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-md font-semibold mb-4 text-blue-400">Company</h3>
            <ul className="space-y-2">
              {['About', 'Careers', 'Contact', 'Legal'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - More compact */}
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

export default Footer2;