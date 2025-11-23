import React from 'react';
import { FileText, DollarSign, CreditCard, Briefcase } from 'lucide-react';
import { TRANSACTION_TYPES, workflowConfig } from '../config/workflowConfig';

const TRANSACTION_ICONS = {
    [TRANSACTION_TYPES.DEPOSIT]: DollarSign,
    [TRANSACTION_TYPES.JOURNAL_ENTRY]: FileText,
    [TRANSACTION_TYPES.PAYMENT]: CreditCard
};

const TransactionTypeSelector = ({ availableTypes, onSelect, selectedType }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-mambu-dark mb-4">Create New Transaction</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableTypes.map(type => {
                    const config = workflowConfig[type];
                    const Icon = TRANSACTION_ICONS[type];
                    const isSelected = selectedType === type;

                    // Ensure config and Icon exist for the type
                    if (!config || !Icon) {
                        console.warn(`Configuration or icon missing for transaction type: ${type} `);
                        return null; // Skip rendering if config or icon is missing
                    }

                    return (
                        <button
                            key={type}
                            onClick={() => onSelect(type)}
                            className={`p - 6 rounded - xl border - 2 transition - all text - left ${isSelected
                                ? 'border-mambu-green bg-green-50 shadow-md'
                                : 'border-slate-200 hover:border-mambu-green hover:bg-slate-50'
                                } `}
                        >
                            <div className={`w - 12 h - 12 rounded - lg flex items - center justify - center mb - 3 ${isSelected ? 'bg-mambu-green' : 'bg-slate-100'
                                } `}>
                                <Icon className={isSelected ? 'text-white' : 'text-slate-600'} size={24} />
                            </div>
                            <h3 className="font-bold text-mambu-dark mb-1">{config.name}</h3>
                            <p className="text-sm text-slate-500">{config.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TransactionTypeSelector;
