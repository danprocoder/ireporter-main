import express from 'express';
import IncidentController from '../controllers/Incident';
import verifyJwtToken from '../middlewares/verifyJwtToken';
import loginRequired from '../middlewares/loginRequired';
import adminRequired from '../middlewares/adminRequired';

const router = express.Router();
router.use(verifyJwtToken, loginRequired);

const controller = new IncidentController('red-flag');

// Get all red flags.
router.get('/api/v1/red-flags', (req, res) => {
  controller.getAll(req, res);
});

// Get a specific red flag record.
router.get('/api/v1/red-flags/:id', (req, res) => {
  controller.get(req, res);
});

// Create a red flag record.
router.post('/api/v1/red-flags', (req, res) => {
  controller.add(req, res);
});

// Edit a specific red-flag record.
router.patch('/api/v1/red-flags/:id', (req, res) => {
  const json = (new IncidentController()).update('red-flag', req.params.id, req.body);
  res.send(json);
});

// Deletes a specific red flag record.
router.delete('/api/v1/red-flags/:id', (req, res) => {
  controller.delete(req, res);
});

export default router;
