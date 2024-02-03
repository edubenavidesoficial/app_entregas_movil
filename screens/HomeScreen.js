// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Solicitar permisos de ubicación
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de ubicación',
            message: 'Necesitamos acceder a tu ubicación para mostrar el mapa.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Permiso de ubicación denegado');
        }
      } catch (error) {
        console.error('Error al solicitar permiso de ubicación:', error);
      }
    };

    requestLocationPermission();

    return () => {
      // Limpiar los recursos al desmontar el componente si es necesario
    };
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      error => {
        console.error('Error al obtener la ubicación:', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {currentLocation && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Tu ubicación"
          />
        </MapView>
      )}
    </View>
  );
};

export default HomeScreen;
