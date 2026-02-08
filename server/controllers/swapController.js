const Swap = require('../models/Swap');

// @desc    Send a swap request
// @route   POST /api/swaps
// @access  Private
const createSwap = async (req, res) => {
  const { recipientId } = req.body;

  if (!recipientId) {
    return res.status(400).json({ message: 'Recipient ID is required' });
  }

  // Prevent requesting yourself
  if (req.user.id === recipientId) {
    return res.status(400).json({ message: 'You cannot request a swap with yourself' });
  }

  const swap = await Swap.create({
    requester: req.user.id,
    recipient: recipientId,
  });

  res.status(201).json(swap);
};

// @desc    Get swaps where I am the recipient
// @route   GET /api/swaps
// @access  Private
const getMySwaps = async (req, res) => {
  // Find swaps where recipient is ME
  // .populate('requester') fetches the name/email of the person who asked!
  const swaps = await Swap.find({ recipient: req.user.id })
    .populate('requester', 'name email') 
    .sort({ createdAt: -1 }); // Newest first

  res.json(swaps);
};

// @desc    Update swap status (Accept/Reject)
// @route   PUT /api/swaps/:id
// @access  Private
const updateSwapStatus = async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  
  // Find the swap by ID
  const swap = await Swap.findById(req.params.id);

  if (!swap) {
    return res.status(404).json({ message: 'Swap request not found' });
  }

  // Security Check: Only the RECIPIENT can accept/reject!
  if (swap.recipient.toString() !== req.user.id) {
    return res.status(401).json({ message: 'Not authorized to manage this swap' });
  }

  swap.status = status;
  await swap.save();

  res.json(swap);
};

module.exports = {
  createSwap,
  getMySwaps,
  updateSwapStatus, // <--- Don't forget this!
};