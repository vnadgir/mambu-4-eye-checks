import React, { useState } from 'react';
import Login from './components/Login';
import DepositForm from './components/DepositForm';
import JournalEntryForm from './components/JournalEntryForm';
import PaymentForm from './components/PaymentForm';
import LoanDisbursementForm from './components/LoanDisbursementForm';
import ApprovalDashboard from './components/ApprovalDashboard';
import TransactionTypeSelector from './components/TransactionTypeSelector';
import { LogOut, Shield, User, LayoutDashboard, PlusCircle } from 'lucide-react';
import { getAvailableTransactionTypes, canApproveTransactionType, getUserSeniorityLevel, isAdmin } from './services/permissionService';
import { ROLES } from './config/roleConfig';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'create', 'approval'
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    // Determine initial view based on roles
    const canCreate = getAvailableTransactionTypes(loggedInUser).length > 0;
    const canApprove = canApproveTransactionType(loggedInUser, 'DEPOSIT') ||
      canApproveTransactionType(loggedInUser, 'JOURNAL_ENTRY') ||
      canApproveTransactionType(loggedInUser, 'PAYMENT') ||
      canApproveTransactionType(loggedInUser, 'LOAN_DISBURSEMENT');

    if (canApprove) {
      setView('approval');
    } else if (canCreate) {
      setView('create');
    } else {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    setSelectedTransactionType(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const availableTypes = getAvailableTransactionTypes(user);
  const canApprove = canApproveTransactionType(user, 'DEPOSIT') ||
    canApproveTransactionType(user, 'JOURNAL_ENTRY') ||
    canApproveTransactionType(user, 'PAYMENT') ||
    canApproveTransactionType(user, 'LOAN_DISBURSEMENT');

  // Get user role display names
  const roleNames = user.roles.map(r => ROLES[r]?.name).join(', ');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shield className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Mambu<span className="text-indigo-600">Ops</span></span>
          </div>

          <div className="flex items-center gap-6">
            {/* Navigation */}
            <nav className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {availableTypes.length > 0 && (
                <button
                  onClick={() => { setView('create'); setSelectedTransactionType(null); }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${view === 'create' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    } `}
                >
                  <PlusCircle size={16} />
                  New Transaction
                </button>
              )}
              {canApprove && (
                <button
                  onClick={() => setView('approval')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${view === 'approval' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    } `}
                >
                  <LayoutDashboard size={16} />
                  Approvals
                </button>
              )}
            </nav>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-slate-800">{user.username}</div>
                <div className="text-xs text-slate-500 truncate max-w-[150px]" title={roleNames}>{roleNames}</div>
              </div>
              <div className="bg-slate-100 p-2 rounded-full">
                <User className="text-slate-600" size={20} />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'create' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!selectedTransactionType ? (
              <TransactionTypeSelector
                availableTypes={availableTypes}
                onSelect={setSelectedTransactionType}
                selectedType={selectedTransactionType}
              />
            ) : (
              <div>
                <button
                  onClick={() => setSelectedTransactionType(null)}
                  className="mb-4 text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  ← Back to Transaction Types
                </button>

                {selectedTransactionType === 'DEPOSIT' && (
                  <DepositForm user={user} />
                )}

                {selectedTransactionType === 'JOURNAL_ENTRY' && (
                  <JournalEntryForm user={user} />
                )}

                {selectedTransactionType === 'PAYMENT' && (
                  <PaymentForm user={user} />
                )}

                {selectedTransactionType === 'LOAN_DISBURSEMENT' && (
                  <LoanDisbursementForm user={user} />
                )}

                {selectedTransactionType !== 'DEPOSIT' && selectedTransactionType !== 'JOURNAL_ENTRY' && selectedTransactionType !== 'PAYMENT' && selectedTransactionType !== 'LOAN_DISBURSEMENT' && (
                  <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
                    <h3 className="text-lg font-medium text-slate-800">Coming Soon</h3>
                    <p className="text-slate-500 mt-2">The form for {selectedTransactionType} is under construction.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === 'approval' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ApprovalDashboard user={user} />
          </div>
        )}
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
