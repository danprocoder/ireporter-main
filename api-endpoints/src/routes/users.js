import express from 'express';
import load from '../helpers/loader';

const router = new express.Router();

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

export default router;
