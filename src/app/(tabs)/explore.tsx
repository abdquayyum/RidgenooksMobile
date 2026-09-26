import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Linking, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { router } from 'expo-router';
import { Navigation } from 'lucide-react-native';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function ExploreScreen() {
    const { properties, currencySymbol, getDisplayPrice, userSettings } = useGlobalState();
  const mapRef = useRef(null);

  // Initial region (Lagos or USA based on properties, let's use first property or default)
  const defaultRegion = properties.length > 0 ? {
    latitude: properties[0].latitude,
    longitude: properties[0].longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  } : {
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const handleNavigate = (lat, lng, label) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Maps application is not installed.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        initialRegion={defaultRegion}
        showsUserLocation={true}
        userInterfaceStyle={userSettings?.dark_mode ? 'dark' : 'light'}
      >
        {properties.map((p) => {
          if (!p.latitude || !p.longitude) return null;
          return (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              pinColor="#f59e0b"
            >
              <Callout onPress={() => router.push(`/property/${p.id}`)}>
                <View style={styles.callout}>
                  <Text style={styles.title}>{p.title}</Text>
                  <Text style={styles.price}>{currencySymbol}{getDisplayPrice(p.price)} / {p.unit}</Text>
                  
                  <TouchableOpacity 
                    style={styles.navButton} 
                    onPress={(e) => {
                      e.stopPropagation();
                      handleNavigate(p.latitude, p.longitude, p.title);
                    }}
                  >
                    <Navigation size={14} color="#ffffff" />
                    <Text style={styles.navText}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  callout: { padding: 5, width: 180, alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 14, marginBottom: 4, textAlign: 'center' },
  price: { color: '#f59e0b', fontWeight: '600', marginBottom: 10 },
  navButton: { flexDirection: 'row', backgroundColor: '#0f172a', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignItems: 'center', marginTop: 5 },
  navText: { color: 'white', fontWeight: 'bold', marginLeft: 4, fontSize: 12 }
});
