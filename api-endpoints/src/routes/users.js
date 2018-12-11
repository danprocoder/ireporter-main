import express from 'express';
import UserController from '../controllers/user';

const router = new express.Router();

const userController = new UserController();

/**
 * APIs
 *
 * @version 1.0
 */

// User signup
router.post('/api/v1/auth/signup', (req, res) => {
  userController.addUser(req, res);
});

// User login.
router.post('/api/v1/auth/login', (req, res) => {
  userController.auth(req, res);
});

export default router;
