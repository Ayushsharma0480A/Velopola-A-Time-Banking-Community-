require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');

// 1. Connect to Database FIRST
connectDB();

const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Routes (Make sure these paths match your folder names exactly)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));
app.use('/api/notes', noteRoutes); 

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});