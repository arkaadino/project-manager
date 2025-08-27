const express = require('express');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Server working!' });
});

app.listen(5000, () => {
  console.log('Test server running on port 5000');
});