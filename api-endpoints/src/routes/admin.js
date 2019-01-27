import express from 'express';
import UserController from '../controllers/user';
import verifyJwtToken from '../middlewares/verifyJwtToken';
import loginRequired from '../middlewares/loginRequired';
import adminRequired from '../middlewares/adminRequired';

const router = new express.Router();

router.use(verifyJwtToken, loginRequired, adminRequired);

const userController = new UserController();

/**
 * APIs
 *
 * @version 1.0
 */

// Returns the total number of users on the platform.
router.get('/api/v1/admin/users/count', (req, res) => {
  userController.getTotalUsers(req, res);
});

// Returns all users registered on the platform
router.get('/api/v1/admin/users', (req, res) => {
	userController.getAllUsers(req, res);
});

export default router;
