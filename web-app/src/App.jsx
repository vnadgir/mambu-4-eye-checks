import React, { useState } from 'react';
import DepositForm from './components/DepositForm';
import Login from './components/Login';
import ApprovalDashboard from './components/ApprovalDashboard';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

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
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <User size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700 capitalize">{user.username} ({user.role})</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {user.role === 'MAKER' ? (
            <DepositForm />
          ) : (
            <ApprovalDashboard />
          )}
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
