'use client';

import React from 'react';

const HomePage = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 via-white to-purple-100 text-center px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
        Welcome to Renty
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl">
        The smart platform for managing tenants, tracking rent, and scaling your property business.
      </p>
    </section>
  );
};

export default HomePage;
