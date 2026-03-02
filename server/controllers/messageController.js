const Swap = require('../models/Swap');

const sendMessage = async (req, res) => {
  const { text } = req.body;
  const swap = await Swap.findById(req.params.id);

  if (!swap) return res.status(404).json({ message: 'Chat session not found' });

  const newMessage = {
    sender: req.user.id,
    text,
    timestamp: new Date()
  };

  swap.messages.push(newMessage);
  await swap.save();
  res.status(201).json(swap.messages);
};

module.exports = { sendMessage };