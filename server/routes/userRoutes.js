const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  addSkill, 
  getUsers, 
  updateLocation // <--- Import this
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(registerUser)
  .get(getUsers);

router.post('/login', loginUser);
router.put('/skills', protect, addSkill);
router.put('/location', protect, updateLocation); // <--- NEW ROUTE

module.exports = router;