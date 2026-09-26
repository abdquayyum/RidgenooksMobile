import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState({ push_notifications: false, location_services: false, dark_mode: false });
  const [currencySymbol, setCurrencySymbol] = useState("₦");
  const [paymentGateway, setPaymentGateway] = useState("paystack");

  return (
    <AppContext.Provider value={{ userSettings, setUserSettings, currencySymbol, setCurrencySymbol, paymentGateway, setPaymentGateway }}>
      {children}
    </AppContext.Provider>
  );
};
