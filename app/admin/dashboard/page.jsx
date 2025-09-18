'use client';

import { useState } from 'react';
import { X, Menu, Box, Mail, FileText } from 'lucide-react';
import ProductsPage from '../products/page'; // Import your existing Products page
import SpecificationsPage from '../specifications/page'; // ✅ relative import

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentModule, setCurrentModule] = useState('products'); // default module

  const menuItems = [
    { name: 'Products', module: 'products', icon: <Box size={20} /> },
    
    { name: 'Specifications', module: 'specifications', icon: <FileText size={20} /> },
    { name: 'Leads', module: 'leads', icon: <Mail size={20} /> },
  ];

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-44' : 'w-16'
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && <h1 className="text-lg font-bold text-green-700">Admin Panel</h1>}
          <button
            className="p-1"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="flex-1 flex flex-col mt-4">
          {menuItems.map((item) => (
            <button
              key={item.module}
              className={`flex items-center gap-2 p-4 hover:bg-green-100 transition ${
                currentModule === item.module ? 'bg-green-200' : ''
              }`}
              onClick={() => setCurrentModule(item.module)}
            >
              {item.icon}
              {sidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {currentModule === 'products' && <ProductsPage />}
        {currentModule === 'leads' && <div>Leads module coming soon</div>}
        {currentModule === 'specifications' && <SpecificationsPage/>}
      </div>
    </div>
    </ProtectedRoute>
  );
}
