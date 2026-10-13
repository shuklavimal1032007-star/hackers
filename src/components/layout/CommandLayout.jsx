import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import DemoBanner from '../ui/DemoBanner';
import ToastContainer from '../ui/ToastContainer';
import SurgeModal from './SurgeModal';

export default function CommandLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [surgeModalOpen, setSurgeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Banner Notice */}
      <DemoBanner onOpenSurgeModal={() => setSurgeModalOpen(true)} />

      {/* Primary Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onOpenSurgeModal={() => setSurgeModalOpen(true)}
      />

      {/* Main Command Console Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenSurgeModal={() => setSurgeModalOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-grid-pattern p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Interactive Surge Modal */}
      <SurgeModal
        isOpen={surgeModalOpen}
        onClose={() => setSurgeModalOpen(false)}
      />

      {/* Global Notifications Toast Stack */}
      <ToastContainer />
    </div>
  );
}
