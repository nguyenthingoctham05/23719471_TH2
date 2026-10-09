import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

type PermissionStatus = 'idle' | 'granted' | 'denied' | 'blocked';
type Coordinates = { latitude: number; longitude: number };

// Tọa độ cổng mẫu để thực hành.
const CAMPUS_GATE: Coordinates = {
  latitude: 10.8222,
  longitude: 106.6875,
};

function distanceKm(from: Coordinates, to: Coordinates) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDifference = radians(to.latitude - from.latitude);
  const longitudeDifference = radians(to.longitude - from.longitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6371 * 2 * Math.atan2(
    Math.sqrt(Math.min(1, a)),
    Math.sqrt(Math.max(0, 1 - a)),
  );
}

export function useCampusLocation() {
  const [status, setStatus] = useState<PermissionStatus>('idle');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [km, setKm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  const setShippingFee = useCartStore(state => state.setShippingFee);
  const mounted = useRef(true);
  const busy = useRef(false);

  const clearLocation = useCallback(() => {
    setCoords(null);
    setKm(null);
    setIsMock(false);
    setShippingFee(null);
  }, [setShippingFee]);

  const applyLocation = useCallback((position: Coordinates, mock: boolean) => {
    if (!mounted.current) return;

    const distance = distanceKm(CAMPUS_GATE, position);
    setCoords(position);
    setKm(distance);
    setIsMock(mock);
    setError('');

    const fee =
      VARIANT.shippingFormula === 'A'
        ? BASE_SHIP_FEE + Math.round(distance * 2000)
        : BASE_SHIP_FEE + Math.round(distance * 1500) + 2000;
    setShippingFee(fee);
  }, [setShippingFee]);

  const requestLocation = useCallback(async (mock = false) => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError('');

    try {
      if (Platform.OS !== 'android') {
        throw new Error('Bước thực hành này dành cho máy ảo Android.');
      }

      const fine = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      const coarse = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

      const existing = await Promise.all([
        PermissionsAndroid.check(fine),
        PermissionsAndroid.check(coarse),
      ]);

      let granted = existing.some(Boolean);

      if (!granted) {
        const results = await PermissionsAndroid.requestMultiple([fine, coarse]);
        granted =
          results[fine] === PermissionsAndroid.RESULTS.GRANTED ||
          results[coarse] === PermissionsAndroid.RESULTS.GRANTED;

        if (!granted) {
          const blocked =
            results[fine] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
            results[coarse] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;

          if (mounted.current) {
            setStatus(blocked ? 'blocked' : 'denied');
            clearLocation();
          }
          return;
        }
      }

      if (!mounted.current) return;
      setStatus('granted');
      clearLocation();

      if (mock) {
        applyLocation({
          latitude: CAMPUS_GATE.latitude + 0.01,
          longitude: CAMPUS_GATE.longitude + 0.01,
        }, true);
        return;
      }

      const position = await new Promise<Coordinates>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          result => resolve({
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
          }),
          locationError => reject(new Error(locationError.message)),
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      });

      applyLocation(position, false);
    } catch (cause) {
      if (mounted.current) {
        setError(cause instanceof Error ? cause.message : 'Không lấy được vị trí.');
      }
    } finally {
      busy.current = false;
      if (mounted.current) setLoading(false);
    }
  }, [applyLocation, clearLocation]);

  useEffect(() => {
    mounted.current = true;

    const subscription = AppState.addEventListener('change', async nextState => {
      if (nextState !== 'active' || Platform.OS !== 'android' || busy.current) {
        return;
      }

      const results = await Promise.all([
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ),
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ),
      ]);

      if (!mounted.current) return;

      if (results.some(Boolean)) {
        setStatus('granted');
      } else {
        setStatus(previous => previous === 'idle' ? 'idle' : 'denied');
        clearLocation();
      }
    });

    return () => {
      mounted.current = false;
      subscription.remove();
    };
  }, [clearLocation]);

  return {
    status,
    coords,
    km,
    loading,
    error,
    isMock,
    requestLocation,
  };
}
