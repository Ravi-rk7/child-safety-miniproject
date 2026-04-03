import { useState, useEffect } from 'react';
import { database, ref, onValue } from '../utils/firebase';

export function useGeofences() {
  const [geofences, setGeofences] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const geofencesRef = ref(database, 'geofences');

    const unsub = onValue(geofencesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setGeofences(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { geofences, loading };
}
