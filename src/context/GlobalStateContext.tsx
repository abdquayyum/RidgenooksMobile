import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authBootstrapped, setAuthBootstrapped] = useState(false);
  
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('userToken');
        const userData = await SecureStore.getItemAsync('userData');
        if (userToken) {
          setAuthToken(userToken);
          if (userData) {
            setCurrentUser(JSON.parse(userData));
          }
          setIsAuthenticated(true);
        }
        setAuthBootstrapped(true);
      } catch (e) {
        console.warn(e);
        setAuthBootstrapped(true);
      } finally { 
        setIsReady(true); 
      }
    };
    bootstrapAsync();
  }, []);

  const [currentScreen, setCurrentScreen] = useState('home'); 
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [userLocationText, setUserLocationText] = useState("Lagos, Nigeria");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("Auto");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState("₦"); 
  const [paymentGateway, setPaymentGateway] = useState("paystack");
  const [mapRegion, setMapRegion] = useState(null); 
  
  const API_URL = "https://api.ridgenooksinc.com"; 

  const [properties, setProperties] = useState([]);

  
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutGuests, setCheckoutGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState({});
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  
  const checkoutNights = (checkInDate && checkOutDate) 
    ? Math.max(1, Math.round((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)))
    : 1;

  useEffect(() => {
    if (showCheckout && selectedProperty) {
      fetch(`${API_URL}/api/properties/${selectedProperty.id}/availability`)
        .then(res => res.json())
        .then(data => {
          let blocked = {};
          data.forEach(booking => {
            let curr = new Date(booking.check_in);
            const end = new Date(booking.check_out);
            while (curr <= end) {
              const dStr = curr.toISOString().split('T')[0];
              blocked[dStr] = true;
              curr.setDate(curr.getDate() + 1);
            }
          });
          setBookedDates(blocked);
        })
        .catch(err => console.log(err));
    }
  }, [showCheckout, selectedProperty]);

  const [showStripeSim, setShowStripeSim] = useState(false);
  
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [savedPropertyIds, setSavedPropertyIds] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userSettings, setUserSettings] = useState({ push_notifications: true, location_services: true, dark_mode: true });

  // Logistics Form State
  const [showLogisticsForm, setShowLogisticsForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [logOrigin, setLogOrigin] = useState("");
  const [logDest, setLogDest] = useState("");
  const [logDate, setLogDate] = useState("");
  const [logDetails, setLogDetails] = useState("");
  const [submittingLogistics, setSubmittingLogistics] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  const getAuthHeader = () => ({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  });

  
  const logout = async () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    } catch(e) { console.warn(e); }
  };

  const loadUserData = async () => {
    if(!authToken) return;
    try {
      // Fetch user profile securely using token
      let meRes = await fetch(`${API_URL}/api/me`, { headers: getAuthHeader() });
      if (meRes.status === 401) { logout(); return; }
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData);
      }

      let res = await fetch(`${API_URL}/api/saved`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setSavedPropertyIds(await res.json());

      res = await fetch(`${API_URL}/api/transactions`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setTransactions(await res.json());

      res = await fetch(`${API_URL}/api/requests`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setRequests(await res.json());

      res = await fetch(`${API_URL}/api/settings`, { headers: getAuthHeader() });
      if (res.status === 401) { logout(); return; }
      setUserSettings(await res.json());
    } catch(e) {
      console.error("Failed to load user data:", e);
    }
  };

  const setNigeriaLocation = () => {
    setUserLocationText("Lagos, Nigeria");
    setCurrencySymbol("₦");
    setPaymentGateway('paystack');
  };

  const setUSALocation = () => {
    setUserLocationText("USA");
    setCurrencySymbol("$");
    setPaymentGateway('stripe');
  };

  const detectLocationByIP = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('https://api.country.is', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const code = (data?.country || '').toUpperCase();
        if (code === 'NG') {
          setNigeriaLocation();
          return true;
        } else if (code === 'US') {
          setUSALocation();
          return true;
        }
      }
    } catch (e) {
      // IP lookup fallback
    }
    return false;
  };

  const detectLocation = async () => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const req = await Location.requestForegroundPermissionsAsync();
        status = req.status;
      }

      if (status !== 'granted') {
        const ipSuccess = await detectLocationByIP();
        if (!ipSuccess) setNigeriaLocation();
        return; 
      }

      // Check last known location first for fast response
      let location = await Location.getLastKnownPositionAsync({}).catch(() => null);

      if (!location) {
        const posPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Location timeout')), 6000));
        location = await Promise.race([posPromise, timeoutPromise]).catch(() => null);
      }

      if (location?.coords) {
        const { latitude: lat, longitude: lng } = location.coords;

        // Direct coordinate check
        // Nigeria bounding box: Lat 4.0 - 14.0, Lng 2.5 - 15.0
        const inNigeriaCoords = lat >= 4.0 && lat <= 14.0 && lng >= 2.5 && lng <= 15.0;
        // USA bounding box (inc. Alaska & Hawaii): Lat 18.0 - 72.0, Lng -180.0 - -65.0
        const inUSACoords = lat >= 18.0 && lat <= 72.0 && lng >= -180.0 && lng <= -65.0;

        if (inNigeriaCoords) {
          setNigeriaLocation();
          return;
        } else if (inUSACoords) {
          setUSALocation();
          return;
        }

        // Reverse geocoding check
        const revPromise = Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        const revTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Geocode timeout')), 5000));
        const reverseGeocode = await Promise.race([revPromise, revTimeout]).catch(() => null);

        if (reverseGeocode && reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          const countryStr = (addr.country || '').toLowerCase();
          const iso = (addr.isoCountryCode || '').toUpperCase();
          const regionStr = (addr.region || '').toLowerCase();

          if (iso === 'NG' || countryStr.includes('nigeria') || regionStr.includes('nigeria')) {
            setNigeriaLocation();
            return;
          } else if (iso === 'US' || countryStr.includes('united states') || countryStr.includes('usa')) {
            setUSALocation();
            return;
          } else {
            setUserLocationText(`${addr.city || addr.region || 'International'}, ${addr.country || ''}`);
            setCurrencySymbol("$");
            setPaymentGateway('stripe');
            return;
          }
        }
      }

      const ipSuccess = await detectLocationByIP();
      if (!ipSuccess) setNigeriaLocation();
    } catch (e) {
      console.warn("Location error:", e);
      const ipSuccess = await detectLocationByIP();
      if (!ipSuccess) setNigeriaLocation();
    }
  };

  const getRawPrice = (price) => currencySymbol === '$' ? Math.round(price / 1500) : price;
  const getDisplayPrice = (price) => price ? getRawPrice(price).toLocaleString() : "0";

  const calculateRegion = (propsList) => {
    if (!propsList || propsList.length === 0) return null;
    if (propsList.length === 1) {
      return {
        latitude: propsList[0].latitude || 6.5244,
        longitude: propsList[0].longitude || 3.3792,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    propsList.forEach(p => {
      const lat = p.latitude || 6.5244;
      const lng = p.longitude || 3.3792;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.5 || 0.0922,
      longitudeDelta: (maxLng - minLng) * 1.5 || 0.0421,
    };
  };

  const activeLocation = selectedLocationFilter === 'Auto' ? userLocationText : selectedLocationFilter;
  const filteredProperties = properties.filter(p => {
    const matchesTab = activeTab === "All" || p.category === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesLocation = true;
    if (activeLocation && activeLocation !== 'All Locations' && activeLocation !== 'Locating...') {
      const isNigeria = activeLocation.toLowerCase().includes('nigeria') || activeLocation.toLowerCase().includes('lagos');
      const isUSA = activeLocation.toLowerCase().includes('usa') || activeLocation.toLowerCase().includes('united states');
      const propLoc = (p.location || '').toLowerCase();

      if (isNigeria) {
        matchesLocation = propLoc.includes('nigeria') || propLoc.includes('lagos');
      } else if (isUSA) {
        matchesLocation = propLoc.includes('usa') || propLoc.includes('united states');
      } else {
        const locTerms = activeLocation.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        matchesLocation = locTerms.some(term => propLoc.includes(term));
      }
    }
    return matchesTab && matchesSearch && matchesLocation;
  });

  useEffect(() => {
    if (!authBootstrapped) return; // Prevent overwriting during initial load
    
    if (authToken && currentUser?.email) {
      SecureStore.setItemAsync('userToken', authToken).catch(console.warn);
      SecureStore.setItemAsync('userData', JSON.stringify(currentUser)).catch(console.warn);
    } else if (!authToken) {
      SecureStore.deleteItemAsync('userToken').catch(console.warn);
      SecureStore.deleteItemAsync('userData').catch(console.warn);
    }
  }, [authToken, currentUser, authBootstrapped]);

  
  const refreshProperties = async () => {
    try {
      const res = await fetch(`${API_URL}/api/properties`);
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error("Failed to refresh properties:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authToken) {
      if(userSettings.location_services) detectLocation();
      refreshProperties();
      
      loadUserData();
    }
  }, [isAuthenticated, authToken, userSettings.location_services]);

  const value = {
    insets,
    isReady, isAuthenticated, setIsAuthenticated, logout,
    authToken, setAuthToken,
    currentScreen, setCurrentScreen,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    userLocationText, setUserLocationText,
    selectedLocationFilter, setSelectedLocationFilter,
    showLocationModal, setShowLocationModal,
    selectedTransaction, setSelectedTransaction,
    currencySymbol, setCurrencySymbol,
    paymentGateway, setPaymentGateway,
    mapRegion, setMapRegion,
    API_URL,
    properties, setProperties,
    currentUser, setCurrentUser,
    selectedProperty, setSelectedProperty,
    showCheckout, setShowCheckout,
    checkoutGuests, setCheckoutGuests,
    bookedDates, setBookedDates,
    checkInDate, setCheckInDate,
    checkOutDate, setCheckOutDate,
    checkoutNights,
    showStripeSim, setShowStripeSim,
    showGallery, setShowGallery,
    galleryImages, setGalleryImages,
    galleryIndex, setGalleryIndex,
    savedPropertyIds, setSavedPropertyIds,
    transactions, setTransactions,
    requests, setRequests,
    userSettings, setUserSettings,
    showLogisticsForm, setShowLogisticsForm,
    selectedService, setSelectedService,
    logOrigin, setLogOrigin,
    logDest, setLogDest,
    logDate, setLogDate,
    logDetails, setLogDetails,
    submittingLogistics, setSubmittingLogistics,
    chatInput, setChatInput,
    messages, setMessages,
    scrollViewRef,
    getAuthHeader,
    loadUserData,
    detectLocation,
    getRawPrice,
    getDisplayPrice,
    calculateRegion,
    activeLocation,
    filteredProperties,
    refreshProperties
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
