import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Platform, Linking, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import { Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function ExploreScreen() {
  const { properties, currencySymbol, getDisplayPrice, userSettings } = useGlobalState();
  const mapRef = useRef(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => setHasLocationPermission(status === 'granted'))
      .catch(() => setHasLocationPermission(false));
  }, []);

  const validProperties = useMemo(() => {
    return properties.filter((p) => {
      const lat = parseFloat(p.latitude);
      const lng = parseFloat(p.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });
  }, [properties]);

  const defaultRegion = useMemo(() => {
    if (validProperties.length > 0) {
      return {
        latitude: parseFloat(validProperties[0].latitude),
        longitude: parseFloat(validProperties[0].longitude),
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    return {
      latitude: 6.5244,
      longitude: 3.3792,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [validProperties]);

  const handleNavigate = (lat, lng, label) => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const cleanLabel = encodeURIComponent(label || 'Property Location');
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latNum},${lngNum}`;
    const url = Platform.select({
      ios: `${scheme}${cleanLabel}@${latLng}`,
      android: `${scheme}${latLng}(${cleanLabel})`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latNum},${lngNum}`);
      }
    }).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latNum},${lngNum}`);
    });
  };

  const handleAndroidMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'VIEW_PROPERTY' && data.id) {
        router.push(`/property/${data.id}`);
      } else if (data.type === 'NAVIGATE') {
        handleNavigate(data.lat, data.lng, data.title);
      }
    } catch (e) {
      console.warn('Map event error:', e);
    }
  };

  const isDarkMode = userSettings?.dark_mode;

  const androidMapHtml = useMemo(() => {
    const centerLat = defaultRegion.latitude;
    const centerLng = defaultRegion.longitude;
    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const propsData = JSON.stringify(
      validProperties.map((p) => ({
        id: p.id,
        title: p.title,
        priceDisplay: `${currencySymbol}${getDisplayPrice(p.price)} / ${p.unit || 'night'}`,
        shortPrice: `${currencySymbol}${getDisplayPrice(p.price)}`,
        latitude: parseFloat(p.latitude),
        longitude: parseFloat(p.longitude),
      }))
    );

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    html, body, #map { width: 100%; height: 100%; background: ${isDarkMode ? '#0f172a' : '#f8fafc'}; overflow: hidden; }
    .custom-pill-wrapper { background: transparent; border: none; }
    .custom-pill {
      background: #f59e0b;
      color: #ffffff;
      font-weight: 700;
      font-size: 11px;
      padding: 5px 9px;
      border-radius: 9999px;
      border: 2px solid #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
      white-space: nowrap;
      text-align: center;
      display: inline-block;
    }
    .leaflet-popup-content-wrapper {
      background: ${isDarkMode ? '#1e293b' : '#ffffff'};
      color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
      border-radius: 16px;
      padding: 4px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    }
    .leaflet-popup-content { margin: 8px 12px; }
    .popup-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; line-height: 1.2; }
    .popup-price { color: #f59e0b; font-weight: 700; font-size: 13px; margin-bottom: 12px; }
    .btn-row { display: flex; gap: 8px; }
    .btn-view {
      background: #f59e0b;
      color: #ffffff;
      border: none;
      padding: 8px 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      flex: 1;
      text-align: center;
    }
    .btn-nav {
      background: #0f172a;
      color: #ffffff;
      border: none;
      padding: 8px 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      flex: 1;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([${centerLat}, ${centerLng}], 12);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('${tileUrl}', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var props = ${propsData};
    var bounds = [];

    props.forEach(function(p) {
      if (!p.latitude || !p.longitude) return;

      var icon = L.divIcon({
        className: 'custom-pill-wrapper',
        html: '<div class="custom-pill">' + p.shortPrice + '</div>',
        iconSize: [80, 28],
        iconAnchor: [40, 14]
      });

      var marker = L.marker([p.latitude, p.longitude], { icon: icon }).addTo(map);
      bounds.push([p.latitude, p.longitude]);

      var safeTitle = p.title.replace(/'/g, "\\\\'");
      var html = '<div class="popup-title">' + p.title + '</div>' +
        '<div class="popup-price">' + p.priceDisplay + '</div>' +
        '<div class="btn-row">' +
          '<button class="btn-view" onclick="sendMsg(\\'VIEW_PROPERTY\\', ' + p.id + ')">View Details</button>' +
          '<button class="btn-nav" onclick="sendNav(\\'NAVIGATE\\', ' + p.latitude + ', ' + p.longitude + ', \\'' + safeTitle + '\\')">Directions</button>' +
        '</div>';

      marker.bindPopup(html);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    function sendMsg(type, id) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, id: id }));
      }
    }

    function sendNav(type, lat, lng, title) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, lat: lat, lng: lng, title: title }));
      }
    }
  </script>
</body>
</html>`;
  }, [defaultRegion, validProperties, isDarkMode, currencySymbol, getDisplayPrice]);

  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{ html: androidMapHtml }}
          style={styles.map}
          onMessage={handleAndroidMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#f59e0b" />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={defaultRegion}
        showsUserLocation={hasLocationPermission}
        userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
      >
        {validProperties.map((p) => {
          const lat = parseFloat(p.latitude);
          const lng = parseFloat(p.longitude);

          return (
            <Marker
              key={p.id}
              coordinate={{ latitude: lat, longitude: lng }}
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
                      handleNavigate(lat, lng, p.title);
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  callout: { padding: 5, width: 180, alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 14, marginBottom: 4, textAlign: 'center' },
  price: { color: '#f59e0b', fontWeight: '600', marginBottom: 10 },
  navButton: { flexDirection: 'row', backgroundColor: '#0f172a', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignItems: 'center', marginTop: 5 },
  navText: { color: 'white', fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
});
