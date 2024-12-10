const express = require('express');
const Person = require('../models/Person');

const router = express.Router();

// Create a Record
router.post('/', async (req, res) => {
  try {
    const person = new Person(req.body);
    const savedPerson = await person.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create Many Records
router.post('/many', async (req, res) => {
  try {
    const people = await Person.create(req.body);
    res.status(201).json(people);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Find People by Name
router.get('/findByName/:name', async (req, res) => {
  try {
    const people = await Person.find({ name: req.params.name });
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Find One Person by Favorite Food
router.get('/findOneByFood/:food', async (req, res) => {
  try {
    const person = await Person.findOne({ favoriteFoods: req.params.food });
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add 'hamburger' to Favorite Foods
router.put('/addFood/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Person not found' });
    person.favoriteFoods.push('hamburger');
    await person.save();
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Persons
router.get('/', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Correct the route path to match your API URL
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting person with ID:', id); // Log the ID

    const deletedPerson = await Person.findByIdAndDelete(id);
    console.log('Deleted Person:', deletedPerson); // Log the result from the database

    if (!deletedPerson) {
      console.error('Person not found with ID:', id); // Log if the person doesn't exist
      return res.status(404).json({ error: 'Person not found' });
    }

    res.status(200).json({ message: 'Person deleted successfully', deletedPerson });
  } catch (error) {
    console.error('Error deleting person:', error.message); // Log the error message
    res.status(500).json({ error: 'Failed to delete person' });
  }
});




module.exports = router;