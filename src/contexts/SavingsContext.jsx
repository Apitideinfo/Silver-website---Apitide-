import React, { createContext, useContext, useState } from 'react';

const SavingsContext = createContext();

export function SavingsProvider({ children }) {
  const [monthlySavingsInput, setMonthlySavingsInput] = useState(2000);
  const [savingsSchemeType, setSavingsSchemeType] = useState('Gold Mine');
  const [savingsEnrollStep, setSavingsEnrollStep] = useState(1);
  
  // Backwards compatibility with the simple email form on Savings/GoldReserve pages
  const [savingsForm, setSavingsForm] = useState({
    email: ''
  });

  const [savingsEnrollForm, setSavingsEnrollForm] = useState({
    name: '',
    mobile: '',
    email: '',
    nomineeName: '',
    nomineeRelationship: 'Spouse',
    paymentMethod: 'card'
  });

  // Sync email between savingsForm and savingsEnrollForm
  const updateSavingsForm = (updated) => {
    setSavingsForm(updated);
    if (updated.email !== undefined) {
      setSavingsEnrollForm(prev => ({ ...prev, email: updated.email }));
    }
  };

  const updateSavingsEnrollForm = (updated) => {
    setSavingsEnrollForm(updated);
    if (updated.email !== undefined) {
      setSavingsForm(prev => ({ ...prev, email: updated.email }));
    }
  };

  return (
    <SavingsContext.Provider value={{
      monthlySavingsInput,
      setMonthlySavingsInput,
      savingsSchemeType,
      setSavingsSchemeType,
      savingsEnrollStep,
      setSavingsEnrollStep,
      savingsForm,
      setSavingsForm: updateSavingsForm,
      savingsEnrollForm,
      setSavingsEnrollForm: updateSavingsEnrollForm
    }}>
      {children}
    </SavingsContext.Provider>
  );
}

export function useSavings() {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
}
