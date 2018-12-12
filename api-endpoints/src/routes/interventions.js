import express from 'express';
import IncidentController from '../controllers/Incident';
import verifyJwtToken from '../middlewares/verifyJwtToken';
import loginRequired from '../middlewares/loginRequired';
import adminRequired from '../middlewares/adminRequired';

const router = express.Router();
router.use(verifyJwtToken, loginRequired);

const controller = new IncidentController('intervention');

// Get all interventions.
router.get('/api/v1/interventions', (req, res) => {
  controller.getAll(req, res);
});

// Get a specific intervention record.
router.get('/api/v1/interventions/:id', (req, res) => {
  controller.get(req, res);
});

// Create an intervention record.
router.post('/api/v1/interventions', (req, res) => {
  controller.add(req, res);
});

// Edit a specific intervention record.
router.patch('/api/v1/interventions/:id', (req, res) => {
  controller.update(req, res);
});

// Deletes a specific intervention record.
router.delete('/api/v1/interventions/:id', (req, res) => {
  controller.delete(req, res);
});

export default router;
