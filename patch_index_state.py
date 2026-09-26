with open("src/app/index.tsx", "r") as f:
    content = f.read()

# 1. Add import
if "GlobalStateProvider" not in content:
    content = content.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { GlobalStateProvider, useGlobalState } from '../context/GlobalStateContext';")

# 2. Modify AppWrapper
old_wrapper = """export default function AppWrapper() {
  return (
    <PaystackProvider publicKey="pk_test_314dccd680068de3e230b7714972b3637607fbfb">
      <App />
    </PaystackProvider>
  );
}"""

new_wrapper = """export default function AppWrapper() {
  return (
    <GlobalStateProvider>
      <PaystackProvider publicKey="pk_test_314dccd680068de3e230b7714972b3637607fbfb">
        <App />
      </PaystackProvider>
    </GlobalStateProvider>
  );
}"""

content = content.replace(old_wrapper, new_wrapper)

import re

# 3. Replace the massive state block in App()
# Find the start of function App()
app_start_idx = content.find("function App() {\n")
if app_start_idx != -1:
    # Find the end of the state block which is right before "const AuthScreen = () => {"
    auth_screen_idx = content.find("  const AuthScreen = () => {", app_start_idx)
    
    if auth_screen_idx != -1:
        # The block to replace
        old_app_block = content[app_start_idx:auth_screen_idx]
        
        new_app_block = """function App() {
  const {
    insets, isAuthenticated, setIsAuthenticated, authToken, setAuthToken,
    currentScreen, setCurrentScreen, activeTab, setActiveTab, searchQuery, setSearchQuery,
    userLocationText, setUserLocationText, selectedLocationFilter, setSelectedLocationFilter,
    showLocationModal, setShowLocationModal, selectedTransaction, setSelectedTransaction,
    currencySymbol, setCurrencySymbol, paymentGateway, setPaymentGateway, mapRegion, setMapRegion,
    API_URL, properties, setProperties, currentUser, setCurrentUser,
    selectedProperty, setSelectedProperty, showCheckout, setShowCheckout,
    checkoutGuests, setCheckoutGuests, bookedDates, setBookedDates,
    checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, checkoutNights,
    showStripeSim, setShowStripeSim, showGallery, setShowGallery,
    galleryImages, setGalleryImages, galleryIndex, setGalleryIndex,
    savedPropertyIds, setSavedPropertyIds, transactions, setTransactions,
    requests, setRequests, userSettings, setUserSettings,
    showLogisticsForm, setShowLogisticsForm, selectedService, setSelectedService,
    logOrigin, setLogOrigin, logDest, setLogDest, logDate, setLogDate,
    logDetails, setLogDetails, submittingLogistics, setSubmittingLogistics,
    chatInput, setChatInput, messages, setMessages, scrollViewRef,
    getAuthHeader, loadUserData, detectLocation, getRawPrice, getDisplayPrice,
    calculateRegion, activeLocation, filteredProperties
  } = useGlobalState();

"""
        content = content.replace(old_app_block, new_app_block)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
