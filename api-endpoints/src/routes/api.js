import express from 'express';
import load from '../helpers/loader';

const router = new express.Router();
router.use(express.urlencoded());
router.use(express.json());

/**
 * APIs
 *
 * @version 1.0
 */

// User signup
router.post('/api/v1/auth/signup', (req, res) => {
  const a = load.controller('user').addUser(req, res);
  res.send(a);
});

// User login.
router.post('/api/v1/auth/login', (req, res) => {
  const a = load.controller('user').auth(req, res);
  res.send(a);
});

// Get all red flags.
router.get('/api/v1/red-flags', (req, res) => {
  const json = load.controller('red-flag').getAll('red-flag');
  res.send(json);
});

// Get a specific red flag record.
router.get('/api/v1/red-flags/:id', (req, res) => {
  const json = load.controller('red-flag').get('red-flag', req.params.id);
  res.send(json);
});

// Create a red flag record.
router.post('/api/v1/red-flags', (req, res) => {
  const json = load.controller('red-flag').add('red-flag', req);
  res.send(json);
});

// Edit a specific red-flag record.
router.patch('/api/v1/red-flags/:id', (req, res) => {
  const json = load.controller('red-flag').update('red-flag', req.params.id, req.body);
  res.send(json);
});

// Deletes a specific red flag record.
router.delete('/api/v1/red-flags/:id', (req, res) => {
  const json = load.controller('red-flag').delete('red-flag', req.params.id);
  res.send(json);
});

export default router;
