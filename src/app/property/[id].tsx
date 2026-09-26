import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { View, Text, Linking, Platform, ActivityIndicator, ScrollView, TouchableOpacity, Image, Dimensions, Alert, Modal } from 'react-native';

import { router } from 'expo-router';
import { useGlobalState } from '../../context/GlobalStateContext';
import { ChevronLeft, Share2, Heart, Star, MapPin, Navigation, Building, Box, Map as MapIcon, Calendar, Check, X, CreditCard, Lock } from 'lucide-react-native';
import { usePaystack } from 'react-native-paystack-webview';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const paystackWebViewRef = React.useRef();
  const { popup } = usePaystack();
    const {
    insets,
    properties, userSettings, currencySymbol, getDisplayPrice, getRawPrice,
    savedPropertyIds, setSavedPropertyIds, API_URL, getAuthHeader,
    showCheckout, setShowCheckout, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate,
    checkoutNights, bookedDates, setBookedDates, paymentGateway, currentUser,
    setShowGallery, setGalleryImages, setGalleryIndex, setMapRegion, showStripeSim, setShowStripeSim, selectedProperty, setCurrentScreen, loadUserData
  } = useGlobalState();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };
  
  const p = selectedProperty;
  if (!p) return <ActivityIndicator size="large" color="#000000" style={{flex: 1, justifyContent: 'center'}} />;

  const isSaved = savedPropertyIds.includes(p?.id);

  const handleNavigate = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${p.latitude},${p.longitude}`;
    const url = Platform.select({
      ios: `${scheme}${p.title}@${latLng}`,
      android: `${scheme}${latLng}(${p.title})`
    });
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
    });
  };


  useEffect(() => {
    if (p) {
      fetch(`${API_URL}/api/properties/${p.id}/availability`)
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
  }, [p]);

  const toggleSave = async () => {
    if (!p) return;
    try {
      const res = await fetch(`${API_URL}/api/saved`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ property_id: p.id })
      });
      if (res.ok) {
        if (isSaved) setSavedPropertyIds(prev => prev.filter(id => id !== p.id));
        else setSavedPropertyIds(prev => [...prev, p.id]);
      }
    } catch(e) {
      console.warn(e);
    }
  };

  const logTransaction = async (ref, amount, gateway) => {
    try {
      const payload = {
        property_id: p.id,
        amount: amount,
        currency: currencySymbol === "$" ? "USD" : "NGN",
        status: "Completed",
        ref: ref || `REF_${Date.now()}`,
        check_in: checkInDate,
        check_out: checkOutDate
      };
      await fetch(`${API_URL}/api/transactions`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(payload) });
      if (currentUser?.email) {
          await loadUserData(currentUser.email);
      }
      setShowCheckout(false);
      router.push('/transactions');
    } catch(e) {
      console.warn(e);
    }
  };

  
  const handleCheckoutClick = async () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert("Missing Dates", "Please select your check-in and check-out dates.");
      return;
    }
    
    if (paymentGateway === 'paystack') {
      popup.checkout({
        amount: (getRawPrice(p.price) * checkoutNights + (currencySymbol === "$" ? 25 : 25000)),
        email: currentUser?.email || "guest@ridgenooks.com",
        reference: "ref_" + Date.now() + Math.floor(Math.random() * 1000),
        currency: currencySymbol === '₦' ? 'NGN' : 'USD',
        onSuccess: async (res) => {
          Alert.alert("Success", "Your booking was successful!");
          await logTransaction(res.reference, (getRawPrice(p.price) * checkoutNights + (currencySymbol === "$" ? 25 : 25000)), 'paystack');
        },
        onCancel: () => {
          Alert.alert("Cancelled", "Payment was cancelled.");
        }
      });
    } else {
      // Real Stripe Checkout Flow
      const rawPrice = getRawPrice(p.price);
      const subtotal = rawPrice * checkoutNights;
      const fee = currencySymbol === '$' ? 25 : 25000;
      const total = subtotal + fee;
      
      try {
        const response = await fetch(`${API_URL}/api/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: Math.round(total * 100), 
            currency: currencySymbol === '$' ? 'usd' : 'ngn',
            property_id: p.id,
            nights: checkoutNights
          })
        });
        const { clientSecret } = await response.json();
        
        if (!clientSecret) {
          Alert.alert("Error", "Failed to retrieve payment intent.");
          return;
        }

        const { error: initError } = await initPaymentSheet({
          merchantDisplayName: "Ridgenooks Inc.",
          paymentIntentClientSecret: clientSecret,
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: currentUser?.name || 'Guest',
            email: currentUser?.email,
          }
        });
        
        if (initError) {
          Alert.alert("Error", initError.message);
          return;
        }

        const { error: presentError } = await presentPaymentSheet();

        if (presentError) {
          Alert.alert("Payment Cancelled", presentError.message);
        } else {
          Alert.alert("Success", "Payment confirmed globally! Your booking is secured.");
          await logTransaction('pi_' + Date.now(), total, 'stripe');
          setShowCheckout(false);
          loadUserData(currentUser.email);
        }
      } catch (err) {
        Alert.alert("Server Error", "Could not connect to payment server.");
      }
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    
    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) { days.push(new Date(today.getFullYear(), today.getMonth(), i)); }

    return (
      <View className="mb-6">
        <Text className={`font-bold mb-3 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Select Dates</Text>
        <View className="flex-row flex-wrap">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d,i) => (
            <Text key={i} className="w-[14%] text-center text-xs font-bold text-slate-400 mb-2">{d}</Text>
          ))}
          {days.map((date, idx) => {
            if (!date) return <View key={`empty-${idx}`} className="w-[14%] h-10" />;
            const dateStr = date.toISOString().split('T')[0];
            const disabled = bookedDates[dateStr] || date < new Date(today.setHours(0,0,0,0));
            const isStart = checkInDate === dateStr;
            const isEnd = checkOutDate === dateStr;
            const isBetween = checkInDate && checkOutDate && dateStr > checkInDate && dateStr < checkOutDate;
            let bgClass = "bg-transparent";
            let textClass = userSettings.dark_mode ? 'text-slate-300' : 'text-slate-700';
            
            if (isStart || isEnd) { bgClass = "bg-amber-500 rounded-full"; textClass = "text-white font-bold"; }
            else if (isBetween) { bgClass = "bg-amber-500/20"; textClass = "text-amber-700"; }
            else if (disabled) { textClass = "text-slate-300 line-through"; }

            return (
              <TouchableOpacity key={idx} disabled={disabled} onPress={() => {
                  if (!checkInDate || (checkInDate && checkOutDate)) { setCheckInDate(dateStr); setCheckOutDate(null); }
                  else if (dateStr > checkInDate) {
                    let isValid = true;
                    let curr = new Date(checkInDate);
                    while (curr <= date) { if (bookedDates[curr.toISOString().split('T')[0]]) isValid = false; curr.setDate(curr.getDate() + 1); }
                    if (isValid) setCheckOutDate(dateStr);
                    else { setCheckInDate(dateStr); setCheckOutDate(null); }
                  } else { setCheckInDate(dateStr); setCheckOutDate(null); }
                }} className={`w-[14%] h-10 items-center justify-center ${bgClass}`}>
                <Text className={textClass}>{date.getDate()}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    );
  };

  if (!p) return <View className="flex-1 justify-center items-center"><Text>Property not found.</Text></View>;
  const displayImages = p.images && p.images.length > 0 ? p.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"];

  return (
    <View className={`flex-1 ${userSettings.dark_mode ? 'bg-slate-900' : 'bg-white'}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="relative h-72 w-full">
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
            {displayImages.map((img, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => { setGalleryImages(displayImages); setGalleryIndex(idx); setShowGallery(true); }}>
                <Image source={{uri: img}} style={{ width, height: 288 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {displayImages.length > 1 && (
            <>
              {/* Animated Dots */}
              <View className="absolute bottom-6 left-0 right-0 flex-row justify-center items-center space-x-1.5">
                {displayImages.map((_, idx) => (
                  <View 
                    key={idx} 
                    style={{
                      height: 8,
                      width: idx === activeImageIndex ? 20 : 8,
                      backgroundColor: idx === activeImageIndex ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                      borderRadius: 4
                    }} 
                  />
                ))}
              </View>

              {/* Swipe Indicator Pill (only shows on first image to teach user) */}
              {activeImageIndex === 0 && (
                <View className="absolute bottom-6 right-5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex-row items-center border border-white/20">
                  <Text className="text-white text-xs font-bold mr-1">Swipe</Text>
                  <Text className="text-white text-xs">👉</Text>
                </View>
              )}
            </>
          )}
          <View className="absolute top-12 left-5 right-5 flex-row justify-between items-center z-10">
            <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 bg-black/30 rounded-full items-center justify-center backdrop-blur-md">
              <ChevronLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <View className="flex-row space-x-3">
              <TouchableOpacity className="h-10 w-10 bg-black/30 rounded-full items-center justify-center backdrop-blur-md"><Share2 size={20} color="#ffffff" /></TouchableOpacity>
              <TouchableOpacity onPress={toggleSave} className="h-10 w-10 bg-black/30 rounded-full items-center justify-center backdrop-blur-md">
                <Heart size={20} color={isSaved ? "#ef4444" : "#ffffff"} fill={isSaved ? "#ef4444" : "transparent"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="p-5">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-4">
              <Text className={`text-2xl font-bold mb-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.title}</Text>
              <View className="flex-row items-center mb-1">
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <Text className={`text-sm font-semibold ml-1 ${userSettings.dark_mode ? 'text-slate-200' : 'text-slate-700'}`}>{p.rating}</Text>
                <Text className="text-slate-400 text-sm ml-1">({p.reviews} reviews)</Text>
              </View>
              <View className="flex-row items-center">
                <MapPin size={14} color="#94a3b8" />
                <Text className={`text-sm ml-1 ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`} numberOfLines={1}>{p.location} • {p.distance}km away</Text>
              </View>
              <TouchableOpacity onPress={handleNavigate} className="flex-row items-center bg-slate-100 rounded-full px-3 py-1.5 mt-2 self-start border border-slate-200">
                <Navigation size={12} color="#0284c7" />
                <Text className="text-sky-600 text-xs font-bold ml-1">Get Directions</Text>
              </TouchableOpacity>

            </View>
          </View>
          
          <View className={`flex-row justify-between border-y py-4 mb-6 ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
            <View className="items-center flex-1"><Building size={20} color="#94a3b8" /><Text className={`font-bold mt-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.beds} <Text className="font-normal text-slate-500 text-xs">Beds</Text></Text></View>
            <View className={`w-px h-full ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`} />
            <View className="items-center flex-1"><Box size={20} color="#94a3b8" /><Text className={`font-bold mt-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.baths} <Text className="font-normal text-slate-500 text-xs">Baths</Text></Text></View>
            <View className={`w-px h-full ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`} />
            <View className="items-center flex-1"><MapIcon size={20} color="#94a3b8" /><Text className={`font-bold mt-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{p.sqft} <Text className="font-normal text-slate-500 text-xs">Sqft</Text></Text></View>
          </View>

          <Text className={`font-bold text-lg mb-2 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Overview</Text>
          <Text className={`text-sm leading-relaxed mb-6 ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>{p.description}</Text>

          {/* Amenities Section */}
          <Text className={`font-bold text-lg mb-3 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Amenities</Text>
          <View className="flex-row flex-wrap mb-6">
            <View className={`w-1/2 flex-row items-center mb-3`}><Box size={16} color="#0284c7" /><Text className={`ml-2 text-sm ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>Fast Wi-Fi</Text></View>
            <View className={`w-1/2 flex-row items-center mb-3`}><Box size={16} color="#0284c7" /><Text className={`ml-2 text-sm ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>Free Parking</Text></View>
            <View className={`w-1/2 flex-row items-center mb-3`}><Box size={16} color="#0284c7" /><Text className={`ml-2 text-sm ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>Swimming Pool</Text></View>
            <View className={`w-1/2 flex-row items-center mb-3`}><Box size={16} color="#0284c7" /><Text className={`ml-2 text-sm ${userSettings.dark_mode ? 'text-slate-300' : 'text-slate-600'}`}>Air Conditioning</Text></View>
          </View>

          {/* Host Section */}
          <Text className={`font-bold text-lg mb-3 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Hosted by</Text>
          <View className="flex-row items-center mb-6">
            <Image source={{uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a'}} className="w-12 h-12 rounded-full mr-3" />
            <View>
              <Text className={`font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>RidgeNooks Management</Text>
              <Text className={`text-xs ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Joined in 2024 • Superhost</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingBottom: Math.max(16, insets?.bottom || 16), paddingTop: 16 }} className={`absolute bottom-0 left-0 right-0 px-5 border-t flex-row items-center justify-between ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <View>
          <Text className={`text-xs ${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Price</Text>
          <Text className={`text-xl font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{getDisplayPrice(p.price)} <Text className="text-sm font-normal text-slate-500">/ {p.unit}</Text></Text>
        </View>
        <TouchableOpacity onPress={() => setShowCheckout(true)} className="bg-amber-500 px-8 py-3 rounded-xl shadow-md"><Text className="text-white font-bold text-base">Book Now</Text></TouchableOpacity>
      </View>

      {showCheckout && (
        <View className="absolute inset-0 z-50 justify-end bg-slate-900/60">
          <View className={`w-full rounded-t-3xl p-6 shadow-2xl ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-white'} pb-10`} style={{ paddingBottom: Math.max(40, (insets?.bottom || 0) + 20) }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-xl font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Booking Configuration</Text>
              <TouchableOpacity onPress={() => setShowCheckout(false)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}><X size={20} color="#64748b" /></TouchableOpacity>
            </View>
            {renderCalendar()}
            <View className="flex-row justify-between items-center mb-4 px-2">
              <View><Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-in</Text><Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkInDate ? checkInDate : '--'}</Text></View>
              <View className="items-end"><Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-out</Text><Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkOutDate ? checkOutDate : '--'}</Text></View>
            </View>
            
            <View className={`border-t pt-4 mb-6 ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row justify-between mb-2">
                <Text className={`${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Subtotal ({checkoutNights} nights)</Text>
                <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{getDisplayPrice(getRawPrice(p.price) * checkoutNights)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className={`${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Service Fee</Text>
                <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{currencySymbol === '$' ? '25' : '25,000'}</Text>
              </View>
              <View className={`flex-row justify-between mt-2 pt-2 border-t ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
                <Text className={`font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Total</Text>
                <Text className={`font-bold text-xl ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{getDisplayPrice(getRawPrice(p.price) * checkoutNights + (currencySymbol === '$' ? 25 : 25000))}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleCheckoutClick} className={`w-full py-4 rounded-xl flex-row justify-center items-center ${paymentGateway === 'paystack' ? 'bg-[#09A5DB]' : 'bg-[#635BFF]'}`}>
              <Lock size={18} color="#ffffff" className="mr-2" />
              <Text className="text-white font-bold text-lg">Pay {currencySymbol}{getDisplayPrice(getRawPrice(p.price) * checkoutNights + (currencySymbol === '$' ? 25 : 25000))}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      
    </View>
  );
}
