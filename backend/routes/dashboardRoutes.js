const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// All routes below are protected (require authentication)
router.use(protect);

// Dashboard statistics route
router.get('/stats', getDashboardStats);

module.exports = router;
