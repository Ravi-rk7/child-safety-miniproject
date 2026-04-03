const { fbGet, fbSet } = require('../models/firebaseModel');

const PLACES = [
  { name: 'Home - Kothrud', lat: 18.5074, lng: 73.8077, radius: 50 },
  { name: 'College - PES Modern College of Engineering', lat: 18.5308, lng: 73.8474, radius: 200 },
  { name: 'Park - Sambhaji Park', lat: 18.5196, lng: 73.8421, radius: 100 },
  { name: 'Grandparents - Deccan', lat: 18.5158, lng: 73.8401, radius: 75 },
];

async function seedData() {
  try {
    const existing = await fbGet('devices/device_001');
    if (existing) {
      console.log('📦 Data already exists, skipping seed.');
      return;
    }

    console.log('🌱 Seeding initial data...');

    await fbSet('devices/device_001', {
      name: "Leo's Tracker",
      childName: 'Atharva wagh',
      deviceId: 'device_001',
      status: 'online',
      battery: 92,
      signal: 'good',
      sosActive: false,
      speed: 0,
      stepCount: 0,
      distanceKm: 0,
      lastUpdated: Date.now(),
      currentLocation: {
        latitude: PLACES[1].lat,
        longitude: PLACES[1].lng,
        timestamp: Date.now(),
        sosStatus: false,
      },
    });

    const geos = {};
    PLACES.forEach((p, i) => {
      geos[`geo_${i}`] = {
        name: p.name.split(' - ')[1] || p.name,
        fullName: p.name,
        icon: ['home', 'school', 'park', 'person_pin_circle'][i],
        latitude: p.lat,
        longitude: p.lng,
        radius: p.radius,
        type: ['Safe Zone', 'High Security', 'Recreational', 'Restricted'][i],
        active: true,
        entryAlerts: true,
        exitAlerts: true,
      };
    });
    await fbSet('geofences', geos);

    const now = Date.now();
    const acts = {};
    [
      { type: 'movement', title: 'Movement Detected', description: 'Active movement detected near the college canteen area.', icon: 'directions_run', off: 0 },
      { type: 'stationary', title: 'Stationary at College', description: 'Device remained at PES Modern college of engineering for 3h 25m.', icon: 'stay_current_portrait', off: -3600000 },
      { type: 'geofence_entry', title: 'Arrived at College', description: 'Safe zone entry: PES Modern college of engineering, Pune.', icon: 'check_circle', off: -7200000 },
      { type: 'geofence_exit', title: 'Left Home', description: 'Heading towards PES Modern college of engineering via FC Road.', icon: 'logout', off: -10800000 },
      { type: 'battery', title: 'Battery Charged', description: 'Device charged to 92%.', icon: 'battery_charging_full', off: -14400000 },
    ].forEach((a, i) => {
      acts[`act_${i}`] = {
        type: a.type,
        title: a.title,
        description: a.description,
        icon: a.icon,
        timestamp: now + a.off,
      };
    });
    await fbSet('activities/device_001', acts);

    console.log('✅ Initial data seeded!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}

module.exports = { seedData, PLACES };
