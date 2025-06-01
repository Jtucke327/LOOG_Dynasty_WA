const express = require('express');
const cors = require('cors');
const leagueRoutes = require('./routes/league');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json());

// Use league-related API routes
app.use('/api', leagueRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});