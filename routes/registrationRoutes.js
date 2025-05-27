const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// POST /api/register - Register a new user
router.post('/register', registrationController.register);

// GET /api/registrations - Get all registrations
router.get('/registrations', registrationController.getAllRegistrations);

module.exports = router;