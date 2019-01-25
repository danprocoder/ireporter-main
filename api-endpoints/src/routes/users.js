import express from 'express';
import UserController from '../controllers/user';
import verifyJwtToken from '../middlewares/verifyJwtToken';
import loginRequired from '../middlewares/loginRequired';

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

// User details using token.
router.get('/api/v1/auth', verifyJwtToken, loginRequired, (req, res) => {
  userController.userInfo(req, res);
});

export default router;
