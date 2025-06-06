const express = require('express');
const cors = require('cors');
const leagueRoutes = require('./routes/league');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');
//Will update once I have domain name
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
}));
app.use(express.json());

// Use league-related API routes
app.use('/api', leagueRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});