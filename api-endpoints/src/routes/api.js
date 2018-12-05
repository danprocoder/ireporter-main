import express from 'express';
import load from '../helpers/loader.js';

const router = new express.Router();

/**
 * APIs
 *
 * @version 1.0
 */

// User signup
router.post('/api/v1/user/new', (req, res) => {
  let a = load.controller('user').addUser(req, res);
  res.send(a);
});

// User login.
router.post('/api/v1/user/auth', (req, res) => {
  let a = load.controller('user').auth(req, res);
  res.send(a);
});

// Get all red flags.
router.get('/api/v1/red-flags', (req, res) => {

});

export default router;
