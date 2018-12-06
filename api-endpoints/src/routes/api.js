import express from 'express';
import load from '../helpers/loader';

const router = new express.Router();

/**
 * APIs
 *
 * @version 1.0
 */

// User signup
router.post('/api/v1/user/new', (req, res) => {
  const a = load.controller('user').addUser(req, res);
  res.send(a);
});

// User login.
router.post('/api/v1/user/auth', (req, res) => {
  const a = load.controller('user').auth(req, res);
  res.send(a);
});

// Get all red flags.
router.get('/api/v1/red-flags', (req, res) => {
  const json = load.controller('red-flag').getAll();
  res.send(json);
});

// Get a specific red flag record.
router.get('/api/v1/red-flags/:id', (req, res) => {
  const json = load.controller('red-flag').get(req.param.id);
  res.send(json);
});

export default router;
