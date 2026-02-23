const express = require('express');
const router = express.Router();
const { getNotes, setNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

// Grouping identical routes together for clean code
router.route('/').get(protect, getNotes).post(protect, setNote);
router.route('/:id').put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;