const mongoose = require('mongoose');

// Define Schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: [String], // Array of strings
});

// Create Model
module.exports = mongoose.model('Person', personSchema);