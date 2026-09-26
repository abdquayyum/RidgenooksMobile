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
  
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('userToken');
        if (userToken) {
          setAuthToken(userToken);
          setIsAuthenticated(true);
        }
        setIsReady(true);
      } catch (e) {
        console.warn(e);
      } finally { setIsReady(true); }
    };
    bootstrapAsync();
  }, []);

  const [currentScreen, setCurrentScreen] = useState('home'); 
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [userLocationText, setUserLocationText] = useState("Locating...");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("Auto");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState("₦"); 
  const [paymentGateway, setPaymentGateway] = useState("paystack");
  const [mapRegion, setMapRegion] = useState(null); 
  
  const API_URL = "https://api.ridgenooksinc.com"; 

  const [properties, setProperties] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: "", email: "", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" });
  
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
    await SecureStore.deleteItemAsync('userToken');
  };

  const loadUserData = async (emailToLoad) => {
    if(!authToken) return;
    try {
      let res = await fetch(`${API_URL}/api/saved`, { headers: getAuthHeader() });
      setSavedPropertyIds(await res.json());

      res = await fetch(`${API_URL}/api/transactions`, { headers: getAuthHeader() });
      setTransactions(await res.json());

      res = await fetch(`${API_URL}/api/requests`, { headers: getAuthHeader() });
      setRequests(await res.json());

      res = await fetch(`${API_URL}/api/settings`, { headers: getAuthHeader() });
      setUserSettings(await res.json());
    } catch(e) {
      console.error("Failed to load user data:", e);
    }
  };

  const detectLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserLocationText("Location Denied");
        return; 
      }
      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      if (reverseGeocode && reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        
        if (addr.country && addr.country.toLowerCase() === 'nigeria') {
          setUserLocationText("Lagos, Nigeria");
          setCurrencySymbol("₦");
          setPaymentGateway('paystack');
        } else if (addr.country && (addr.country.toLowerCase() === 'united states' || addr.country.toLowerCase() === 'usa' || addr.isoCountryCode === 'US')) {
          setUserLocationText("USA");
          setCurrencySymbol("$");
          setPaymentGateway('stripe');
        } else {
          setUserLocationText(`${addr.city || addr.region}, ${addr.country}`);
          setCurrencySymbol("$");
          setPaymentGateway('stripe');
        }
      }
    } catch (e) {
      console.warn("Location error:", e);
      setUserLocationText("Unknown Location");
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
    if (activeLocation !== 'All Locations' && activeLocation !== 'Locating...' && activeLocation !== 'Location Denied') {
      const locTerms = activeLocation.toLowerCase().split(',').map(s => s.trim());
      const propLoc = p.location.toLowerCase();
      matchesLocation = locTerms.some(term => propLoc.includes(term));
    }
    return matchesTab && matchesSearch && matchesLocation;
  });

  useEffect(() => {
    if (authToken) {
      SecureStore.setItemAsync('userToken', authToken).catch(console.warn);
    } else {
      SecureStore.deleteItemAsync('userToken').catch(console.warn);
    }
  }, [authToken]);

  useEffect(() => {
    if (isAuthenticated && authToken) {
      if(userSettings.location_services) detectLocation();
      fetch(`${API_URL}/api/properties`)
        .then(res => res.json())
        .then(data => setProperties(data))
        .catch(err => console.error("Failed to load properties:", err));
      
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
    filteredProperties
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
