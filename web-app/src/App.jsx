import React from 'react';
import DepositForm from './components/DepositForm';
import { LayoutDashboard } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mambu Operations</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
              System Operational
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DepositForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Mambu Operations Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
