const { fbUpdate, fbPush } = require('../models/firebaseModel');
const { PLACES } = require('./seeder');

let simState = {
  lat: PLACES[1].lat,
  lng: PLACES[1].lng,
  targetIdx: 0,
  battery: 92,
  steps: 0,
  distKm: 0,
  moving: false,
  speed: 0,
};

function tickSimulator() {
  const s = simState;

  if (Math.random() > 0.6) {
    s.moving = true;
    s.targetIdx = Math.floor(Math.random() * PLACES.length);
  }

  if (s.moving) {
    const t = PLACES[s.targetIdx];
    const dlat = t.lat - s.lat;
    const dlng = t.lng - s.lng;
    const dist = Math.sqrt(dlat * dlat + dlng * dlng);

    if (dist < 0.001) {
      s.moving = false;
      s.speed = 0;
    } else {
      const step = 0.0008 + Math.random() * 0.0005;
      s.lat += (dlat / dist) * step;
      s.lng += (dlng / dist) * step;
      s.speed = 2.5 + Math.random() * 2;
      s.steps += Math.floor(30 + Math.random() * 50);
      s.distKm += step * 111;
    }
  } else {
    // Hold position perfectly still when stationary, no random jitter
    s.speed = 0;
  }

  s.battery = Math.max(15, s.battery - (0.1 + Math.random() * 0.2));

  return {
    latitude: parseFloat(s.lat.toFixed(6)),
    longitude: parseFloat(s.lng.toFixed(6)),
    battery: Math.round(s.battery),
    signal: s.battery > 30 ? 'good' : 'weak',
    speed: parseFloat(s.speed.toFixed(1)),
    stepCount: s.steps,
    distanceKm: parseFloat(s.distKm.toFixed(2)),
    moving: s.moving,
    timestamp: Date.now(),
  };
}

function startSimulator() {
  console.log('🛰️  GPS Simulator started (Pune, India)');
  setInterval(async () => {
    try {
      const d = tickSimulator();

      await fbUpdate('devices/device_001', {
        battery: d.battery,
        signal: d.signal,
        status: 'online',
        speed: d.speed,
        stepCount: d.stepCount,
        distanceKm: d.distanceKm,
        lastUpdated: d.timestamp,
        currentLocation: {
          latitude: d.latitude,
          longitude: d.longitude,
          timestamp: d.timestamp,
          sosStatus: false,
        },
      });

      if (Math.random() < 0.33) {
        await fbPush('locationHistory/device_001', {
          latitude: d.latitude,
          longitude: d.longitude,
          timestamp: d.timestamp,
          sosStatus: false,
        });
      }

      if (Math.random() < 0.04) {
        const options = [
          { type: 'movement', title: 'Movement Detected', description: 'Walking detected near FC Road, Pune.', icon: 'directions_run' },
          { type: 'stationary', title: 'Stationary Detected', description: 'No movement for 10 minutes.', icon: 'stay_current_portrait' },
        ];
        const act = options[Math.floor(Math.random() * options.length)];
        await fbPush('activities/device_001', { ...act, timestamp: Date.now() });
      }

      console.log(`📍 ${d.latitude}, ${d.longitude} | 🔋 ${d.battery}% | ${d.moving ? '🚶 Moving' : '🧍 Still'}`);
    } catch (err) {
      console.error('Simulator tick error:', err.message);
    }
  }, 60000); // Every 1 minute
}

module.exports = { startSimulator };
