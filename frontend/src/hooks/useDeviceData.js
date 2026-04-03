import { useState, useEffect } from 'react';
import { database, ref, onValue } from '../utils/firebase';

export function useDeviceData(deviceId = 'device_001') {
  const [device, setDevice] = useState(null);
  const [history, setHistory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to device data in real-time
    const deviceRef = ref(database, `devices/${deviceId}`);
    const historyRef = ref(database, `locationHistory/${deviceId}`);
    const activitiesRef = ref(database, `activities/${deviceId}`);

    const unsubDevice = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setDevice(data);
      setLoading(false);
    });

    const unsubHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setHistory(arr);
      }
    });

    const unsubActivities = onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setActivities(arr);
      }
    });

    return () => {
      unsubDevice();
      unsubHistory();
      unsubActivities();
    };
  }, [deviceId]);

  return { device, history, activities, loading };
}
