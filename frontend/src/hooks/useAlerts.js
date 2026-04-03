import { useState, useEffect } from 'react';
import { database, ref, onValue } from '../utils/firebase';

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const alertsRef = ref(database, 'alerts');

    const unsub = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.entries(data)
          .map(([id, d]) => ({ id, ...d }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setAlerts(arr);
        setUnreadCount(arr.filter(a => !a.read).length);
      }
    });

    return () => unsub();
  }, []);

  return { alerts, unreadCount };
}
