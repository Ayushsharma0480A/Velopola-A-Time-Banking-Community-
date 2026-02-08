const express = require('express');
const router = express.Router();
const { createSwap, getMySwaps, updateSwapStatus } = require('../controllers/swapController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createSwap)
  .get(protect, getMySwaps);

// NEW ROUTE for handling Accept/Reject
// PUT /api/swaps/12345
router.put('/:id', protect, updateSwapStatus); // <--- ADD THIS

module.exports = router;