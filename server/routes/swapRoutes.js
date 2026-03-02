const express = require('express');
const router = express.Router();
const { 
  createSwap, 
  getMySwaps, 
  updateSwapStatus, 
  completeSwap // Import the new controller function
} = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createSwap)
  .get(protect, getMySwaps);

// Handle status updates, meeting links, and messages
router.put('/:id', protect, updateSwapStatus);

// NEW: Handle the actual credit transfer (The Motto)
router.put('/:id/complete', protect, completeSwap);

module.exports = router;