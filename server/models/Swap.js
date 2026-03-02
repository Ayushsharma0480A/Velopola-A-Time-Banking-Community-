const mongoose = require('mongoose');

const swapSchema = mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'], // Added 'completed'
      default: 'pending',
    },
    // --- NEW FIELDS FOR COMMUNICATION & MOTTO ---
    meetingLink: {
      type: String,
      default: ''
    },
    scheduledDate: {
      type: Date
    },
    messages: [{
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      timestamp: { type: Date, default: Date.now }
    }],
    isCreditTransferred: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Swap', swapSchema);