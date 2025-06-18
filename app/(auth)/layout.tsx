'use client';

import Image from 'next/image';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-[1fr_1.5fr] bg-gray-50">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-b from-blue-100 to-purple-100 p-10">
        {/* Top: Company Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Renty</h1>
          <p className="text-lg text-gray-700">
            Simplify your property management with our modern, powerful tools.
          </p>
        </div>

        {/* Bottom: Image */}
        <div className="w-full h-80 mt-auto">
          <Image
            src="https://i.pinimg.com/736x/41/24/bb/4124bb415132a2ba5a19133ceb578a32.jpg"
            alt="Welcome"
            className="object-cover w-full h-full rounded-xl shadow-lg"
            width={500}
            height={320}
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          {children}
        </div>
      </div>
    </main>
  );
}
