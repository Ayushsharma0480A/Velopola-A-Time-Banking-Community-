const Swap = require('../models/Swap');
const User = require('../models/User');

// ... keep createSwap and getMySwaps as they are ...

// @desc    Update swap status (Accept/Reject/Schedule)
const updateSwapStatus = async (req, res) => {
  const { status, meetingLink, scheduledDate } = req.body;
  const swap = await Swap.findById(req.params.id);

  if (!swap) return res.status(404).json({ message: 'Swap not found' });
  if (swap.recipient.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

  // Update fields if provided
  if (status) swap.status = status;
  if (meetingLink) swap.meetingLink = meetingLink;
  if (scheduledDate) swap.scheduledDate = scheduledDate;

  await swap.save();
  res.json(swap);
};

// @desc    Finalize the swap and transfer credits (THE MOTTO)
// @route   PUT /api/swaps/:id/complete
const completeSwap = async (req, res) => {
  const swap = await Swap.findById(req.params.id);

  if (!swap) return res.status(404).json({ message: 'Swap not found' });
  if (swap.status !== 'accepted') return res.status(400).json({ message: 'Swap must be accepted first' });

  // 1. The Provider (Recipient) earns 1 hour
  await User.findByIdAndUpdate(swap.recipient, { $inc: { credits: 1 } });
  
  // 2. The Requester loses 1 hour
  await User.findByIdAndUpdate(swap.requester, { $inc: { credits: -1 } });

  // 3. Mark as completed
  swap.status = 'completed';
  swap.isCreditTransferred = true;
  await swap.save();

  res.json({ message: 'Credits transferred successfully', swap });
};

module.exports = { createSwap, getMySwaps, updateSwapStatus, completeSwap };