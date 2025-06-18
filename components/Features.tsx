'use client';

import React from 'react';
import { CreditCard, Users, Home, BarChart3, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: "Automated Rent Collection",
    description: "Set up automatic payments and never chase rent again. Send reminders and track payments effortlessly.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Tenant Management",
    description: "Keep detailed tenant profiles, lease agreements, and communication history all in one place.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Home,
    title: "Property Oversight",
    description: "Monitor property conditions, schedule maintenance, and track expenses across your entire portfolio.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "Financial Reporting",
    description: "Generate comprehensive reports and track your rental income, expenses, and profitability.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Bank-level security with full compliance to protect your data and ensure legal requirements.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Get help whenever you need it with our dedicated support team available around the clock.",
    gradient: "from-teal-500 to-blue-500"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Manage Your Properties
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools property managers need to streamline operations, 
            increase efficiency, and grow their rental business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
            See All Features
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
