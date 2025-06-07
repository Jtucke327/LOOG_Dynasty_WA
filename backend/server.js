const express = require('express');
const cors = require('cors');
const leagueRoutes = require('./routes/league');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(cors({
  origin: 'https://league-of-ordinary-gentlemen.netlify.app'
}));

app.use(express.json());
app.use('/api', leagueRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
