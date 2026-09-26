import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { useGlobalState } from '../context/GlobalStateContext';

const { width, height } = Dimensions.get('window');

export default function GlobalModals() {
  const { 
    userSettings, showLocationModal, setShowLocationModal,
    activeLocation, setSelectedLocationFilter,
    showGallery, setShowGallery, galleryImages, galleryIndex 
  } = useGlobalState();

    const LOCATIONS = ["All Locations", "Lagos, Nigeria", "USA"];

  const [activeGalleryIndex, setActiveGalleryIndex] = React.useState(0);
  React.useEffect(() => {
    if (showGallery) setActiveGalleryIndex(galleryIndex || 0);
  }, [showGallery, galleryIndex]);

  const handleGalleryScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveGalleryIndex(Math.round(index));
  };

  return (
    <>
      <Modal visible={showLocationModal} animationType="fade" transparent>
        <View className="flex-1 justify-center bg-slate-900/80 p-5">
          <View className={`w-full rounded-3xl p-6 shadow-2xl ${userSettings?.dark_mode ? 'bg-slate-800' : 'bg-white'}`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-xl font-bold ${userSettings?.dark_mode ? 'text-white' : 'text-slate-900'}`}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings?.dark_mode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            {LOCATIONS.map(loc => (
              <TouchableOpacity 
                key={loc} 
                onPress={() => { setSelectedLocationFilter(loc); setShowLocationModal(false); }}
                className={`p-4 rounded-xl mb-3 border ${activeLocation === loc ? 'border-amber-500 bg-amber-500/10' : (userSettings?.dark_mode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50')}`}
              >
                <Text className={`font-bold ${activeLocation === loc ? 'text-amber-500' : (userSettings?.dark_mode ? 'text-slate-300' : 'text-slate-700')}`}>{loc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={showGallery} animationType="fade" transparent>
        <View className="flex-1 bg-black justify-center items-center">
          <TouchableOpacity onPress={() => setShowGallery(false)} className="absolute top-16 right-5 z-50 h-10 w-10 bg-white/20 rounded-full items-center justify-center">
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
          
          {galleryImages?.length > 0 && (
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              className="w-full"
              contentOffset={{ x: galleryIndex * width, y: 0 }}
              onScroll={handleGalleryScroll}
              scrollEventThrottle={16}
            >
              {galleryImages.map((img, i) => (
                <View key={i} style={{ width, height: height, justifyContent: 'center' }}>
                  <Image source={{uri: img}} style={{width, height: height * 0.7}} resizeMode="contain" />
                </View>
              ))}
            </ScrollView>
          )}
          
          <View className="absolute bottom-12 w-full flex-row justify-center items-center">
            <View className="bg-white/20 rounded-full px-4 py-2">
              <Text className="text-white font-bold tracking-widest uppercase text-xs">Swipe to explore</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
