import React, { useState } from 'react';
import { authenticateUser, getAllTestUsers } from '../services/userService';
import { Shield, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Notification from './Notification';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification(null);

        // Simulate network delay for better UX feel
        await new Promise(resolve => setTimeout(resolve, 600));

        try {
            const user = authenticateUser(email, password);
            if (user) {
                setNotification({ type: 'success', message: 'Login successful', details: `Welcome back, ${user.username}!` });
                setTimeout(() => onLogin(user), 800);
            } else {
                setNotification({ type: 'error', message: 'Login failed', details: 'Invalid email or password. Please try again.' });
                setIsLoading(false);
            }
        } catch {
            setNotification({ type: 'error', message: 'System Error', details: 'An unexpected error occurred. Please try again later.' });
            setIsLoading(false);
        }
    };

    const handleQuickLogin = (testEmail) => {
        setEmail(testEmail);
        setPassword('mambu'); // Auto-fill default password
    };

    const testUsers = getAllTestUsers();

    // Group users by department for better display (Logic removed as unused)
    // const usersByDept = ... (removed)

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    details={notification.details}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-mambu-green p-3 rounded-xl shadow-lg">
                        <Shield className="text-white h-10 w-10" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Mambu 4-Eyes Check
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Secure Transaction Approval System
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="focus:ring-mambu-green focus:border-mambu-green block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2"
                                    placeholder="you@mambu.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-mambu-green focus:border-mambu-green block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mambu-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mambu-green disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">
                                    Quick Login (Test Users)
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(testUsers).map(([email, user]) => (
                                <button
                                    key={user.email}
                                    onClick={() => handleQuickLogin(user.email)}
                                    className="w-full flex items-center justify-between px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mambu-green text-left group"
                                >
                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className="font-medium truncate w-full">{user.username}</span>
                                        <span className="text-xs text-slate-500 truncate w-full">{user.roles.join(', ')}</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-mambu-green opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
