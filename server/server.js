require('dotenv').config();
require('dotenv').config();
console.log("Mongo URI is:", process.env.MONGO_URI); // <--- Add this line

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the connection function

// Connect to Database
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
// --- ADD THIS SECTION ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));
// ------------------------

app.get('/', (req, res) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});