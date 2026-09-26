const calculateRegion = (properties) => {
  if (!properties || properties.length === 0) return null;
  if (properties.length === 1) {
    return {
      latitude: properties[0].latitude || 6.5244,
      longitude: properties[0].longitude || 3.3792,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }
  
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  properties.forEach(p => {
    const lat = p.latitude || 6.5244;
    const lng = p.longitude || 3.3792;
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });
  
  const latDelta = (maxLat - minLat) * 1.5 || 0.0922;
  const lngDelta = (maxLng - minLng) * 1.5 || 0.0421;
  
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};
