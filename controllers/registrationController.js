const Registration = require('../models/Training');

// Register a new user
const register = async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all registrations
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, getAllRegistrations };