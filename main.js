const express = require('express');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/signup.html'));
});
app.post('/signup', (req, res) => {

});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});
app.post('/login', (req, res) => {

});

// assets
app.use(express.static(path.join(__dirname, 'frontend')));

// APIs
// Version 1
app.get('/api/v1/red-flags', (req, res) => {

});

const server = app.listen(8001, () => {
  console.log('Server started :8001');
});
