const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const load = require('./loader.js');

const app = express();
const urlEncodedParser = bodyParser.urlencoded({extended: false});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/signup.html'));
});
app.post('/signup', urlEncodedParser, load.controller('user').addUser);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/login.html'));
});
app.post('/login', urlEncodedParser, load.controller('user').auth);

// assets
app.use(express.static(path.join(__dirname, 'frontend')));

/**
 * APIs
 *
 * @version 1.0
 */
// Version 1
app.get('/api/v1/red-flags', (req, res) => {

});

const server = app.listen(8001, () => {
  console.log('Server started :8001');
});
