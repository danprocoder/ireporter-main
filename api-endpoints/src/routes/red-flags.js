import express from 'express';
import IncidentController from '../controllers/Incident';
import verifyJwtToken from '../middlewares/verifyJwtToken';
import loginRequired from '../middlewares/loginRequired';
import adminRequired from '../middlewares/adminRequired';
import adminNotRequired from '../middlewares/adminNotRequired';

const router = express.Router();
router.use(verifyJwtToken, loginRequired);

const controller = new IncidentController('red-flag');

// Get all red flags.
router.get('/api/v1/red-flags', (req, res) => {
  controller.getAll(req, res);
});

router.get('/api/v1/red-flags/stats', (req, res) => {
  controller.getStats(req, res);
});

// Get a specific red flag record.
router.get('/api/v1/red-flags/:id', (req, res) => {
  controller.get(req, res);
});

// Create a red flag record.
router.post('/api/v1/red-flags', adminNotRequired, (req, res) => {
  controller.add(req, res);
});

// Edit a specific red-flag record.
router.patch('/api/v1/red-flags/:id', adminNotRequired, (req, res) => {
  controller.update(req, res);
});

// Deletes a specific red flag record.
router.delete('/api/v1/red-flags/:id', adminNotRequired, (req, res) => {
  controller.delete(req, res);
});

// Update a specific red-flag record's status.
router.patch('/api/v1/red-flags/:id/status', adminRequired, (req, res) => {
  controller.updateStatus(req, res);
});

// Adds uploaded images
router.patch('/api/v1/red-flags/:id/addImage', adminNotRequired, (req, res) => {
  controller.uploadEvidences(req, res);
});

export default router;
