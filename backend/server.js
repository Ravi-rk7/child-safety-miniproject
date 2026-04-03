const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Custom imports
const { DB_URL } = require('./config/firebaseConfig');
const deviceRoutes = require('./routes/deviceRoutes');
const geofenceRoutes = require('./routes/geofenceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const activityRoutes = require('./routes/activityRoutes');
const { seedData } = require('./utils/seeder');
const { startSimulator } = require('./utils/simulator');

// ============ Express Setup ============
const app = express();
app.use(cors());
app.use(express.json());

// ============ Routes ============
app.use('/api/devices', deviceRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/activities', activityRoutes);

// ============ START ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n🚀 Guardian Nexus Backend → http://localhost:${PORT}`);
  console.log(`📡 Firebase DB → ${DB_URL}\n`);
  
  // Initialize data and simulator
  await seedData();
  startSimulator();
});
