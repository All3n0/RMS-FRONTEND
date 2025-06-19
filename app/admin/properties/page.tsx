'use client';

import Link from 'next/link';
import { BuildingOffice2Icon, WrenchScrewdriverIcon, HomeModernIcon } from '@heroicons/react/24/solid';

export default function PropertiesPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-black">Properties</h1>
        <p className="text-gray-600 mt-1">Manage your rental properties and details</p>
      </div>

      {/* Add Property Button */}
      <div>
        <Link href="/properties/add">
          <button className="btn btn-neutral px-6">+ Add Property</button>
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/properties/occupied">
          <div className="bg-white hover:shadow-lg transition-shadow duration-300 rounded-lg border-l-8 border-green-500 p-6 flex items-center gap-4 cursor-pointer">
            <BuildingOffice2Icon className="h-10 w-10 text-black bg-white p-1 rounded" />
            <div>
              <h2 className="text-xl font-semibold text-black">Occupied</h2>
              <p className="text-green-600 font-bold text-lg">12 Units</p>
            </div>
          </div>
        </Link>

        <Link href="/properties/vacant">
          <div className="bg-white hover:shadow-lg transition-shadow duration-300 rounded-lg border-l-8 border-yellow-400 p-6 flex items-center gap-4 cursor-pointer">
            <HomeModernIcon className="h-10 w-10 text-black bg-white p-1 rounded" />
            <div>
              <h2 className="text-xl font-semibold text-black">Vacant</h2>
              <p className="text-yellow-500 font-bold text-lg">5 Units</p>
            </div>
          </div>
        </Link>

        <Link href="/properties/maintenance">
          <div className="bg-white hover:shadow-lg transition-shadow duration-300 rounded-lg border-l-8 border-red-500 p-6 flex items-center gap-4 cursor-pointer">
            <WrenchScrewdriverIcon className="h-10 w-10 text-black bg-white p-1 rounded" />
            <div>
              <h2 className="text-xl font-semibold text-black">Maintenance</h2>
              <p className="text-red-600 font-bold text-lg">3 Requests</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
