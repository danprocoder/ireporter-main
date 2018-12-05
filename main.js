import express from 'express';
import path from 'path';
import load from './loader.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/login.html'));
});

// assets
app.use(express.static(path.join(__dirname, 'frontend')));

/**
 * APIs
 *
 * @version 1.0
 */

// User signup
app.post('/api/v1/user/new', urlEncodedParser, (req, res) => {
  let a = load.controller('user').addUser(req, res);
  res.send(a);
});

// User login.
app.post('/api/v1/user/auth', urlEncodedParser, (req, res) => {
  let a = load.controller('user').auth(req, res);
  res.send(a);
});

// Get all red flags.
app.get('/api/v1/red-flags', (req, res) => {

});

const server = app.listen(8001, () => {
  console.log('Server started :8001');
});
