const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/signup', (req, res) => {

});
app.post('/signup', (req, res) => {

});

app.get('/login', (req, res) => {

});
app.post('/login', (req, res) => {

});

// APIs
// Version 1
app.get('/api/v1/red-flags', (req, res) => {

});

const server = app.listen(8001, () => {
  console.log('Starting server');
});
