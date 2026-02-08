const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skillsOffered: { type: [String], default: [] }, // e.g., ["Guitar", "Coding"]
    credits: { type: Number, default: 3 }, // Free credits to start
    location: { type: String, default: 'Earth' },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);