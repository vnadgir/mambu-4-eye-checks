import React, { useState } from 'react';
import { LogIn, Users } from 'lucide-react';
import { authenticateUser, getAllTestUsers } from '../services/userService';
import { ROLES } from '../config/roleConfig';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showTestUsers, setShowTestUsers] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = authenticateUser(username, password);

        if (user) {
            onLogin(user);
        } else {
            setError('Invalid username or password');
        }
    };

    const handleQuickLogin = (email) => {
        const user = authenticateUser(email, 'mambu');
        if (user) {
            onLogin(user);
        }
    };

    const testUsers = getAllTestUsers();
    const groupedUsers = {
        'Deposit Department': testUsers.filter(u => u.roles.some(r => r.includes('DEPOSIT'))),
        'Accounting Department': testUsers.filter(u => u.roles.some(r => r.includes('ACCOUNT') || r.includes('JOURNAL'))),
        'Treasury Department': testUsers.filter(u => u.roles.some(r => r.includes('PAYMENT') || r.includes('TREASURY'))),
        'Management': testUsers.filter(u => u.roles.some(r => ['SENIOR_MANAGER', 'FINANCE_DIRECTOR', 'CFO'].includes(r))),
        'Other': testUsers.filter(u => u.roles.includes('ADMIN') || u.email === 'multi-role@test.com')
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full">
                        <LogIn className="text-indigo-600" size={32} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Sign In to Mambu Ops</h2>
                <p className="text-center text-slate-500 text-sm mb-6">Multi-stage workflow system</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. maker1@test.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="mambu"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Sign In
                    </button>
                </form>

                <div className="border-t border-slate-200 pt-4">
                    <button
                        onClick={() => setShowTestUsers(!showTestUsers)}
                        className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors"
                    >
                        <Users size={16} />
                        {showTestUsers ? 'Hide' : 'Show'} Test Users
                    </button>

                    {showTestUsers && (
                        <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
                            {Object.entries(groupedUsers).map(([dept, users]) => (
                                users.length > 0 && (
                                    <div key={dept}>
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">{dept}</h3>
                                        <div className="space-y-1">
                                            {users.map(user => (
                                                <button
                                                    key={user.email}
                                                    onClick={() => handleQuickLogin(user.email)}
                                                    className="w-full text-left p-2 rounded-lg hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-colors"
                                                >
                                                    <div className="font-medium text-sm text-slate-800">{user.username}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {user.roles.map(role => (
                                                            <span key={role} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                                {ROLES[role]?.name || role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center text-xs text-slate-400">
                    All test users have password: <span className="font-mono">mambu</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
