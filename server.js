const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI="mongodb://localhost:27017/mydatabase"
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Import the User model from the User.js file
const User = require('./models/User');

// Middleware for parsing JSON data
app.use(express.json());

// Routes
app.get('/users', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/users', (req, res) => {
  const { name, age } = req.body;

  const user = new User({ name, age });
  user.save()
    .then(savedUser => res.status(201).json(savedUser))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  User.findByIdAndUpdate(id, { name, age }, { new: true })
    .then(updatedUser => res.json(updatedUser))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  User.findByIdAndRemove(id)
    .then(removedUser => res.json(removedUser))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
