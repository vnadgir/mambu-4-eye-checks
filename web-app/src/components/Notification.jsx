import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Notification = ({ type = 'success', message, details, onClose, autoClose = 5000 }) => {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoClose);
            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    const isSuccess = type === 'success';

    return (
        <div className={`fixed top-20 right-4 z-50 max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden animate-in slide-in-from-right duration-300 ${isSuccess ? 'bg-white' : 'bg-white'
            }`}>
            <div className={`flex-1 w-0 p-4 ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        {isSuccess ? (
                            <CheckCircle className="h-10 w-10 text-mambu-green" aria-hidden="true" />
                        ) : (
                            <AlertCircle className="h-10 w-10 text-red-500" aria-hidden="true" />
                        )}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className={`text-sm font-medium ${isSuccess ? 'text-green-900' : 'text-red-900'}`}>
                            {message}
                        </p>
                        {details && (
                            <p className={`mt-1 text-sm ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                                {details}
                            </p>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className={`bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSuccess ? 'focus:ring-green-500' : 'focus:ring-red-500'
                                }`}
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
