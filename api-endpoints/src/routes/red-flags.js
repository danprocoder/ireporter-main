import express from 'express';
import IncidentController from '../controllers/Incident';
import verifyJwtToken from '../middlewares/verifyJwtToken';
import loginRequired from '../middlewares/loginRequired';
import adminRequired from '../middlewares/adminRequired';

const router = express.Router();
router.use(verifyJwtToken, loginRequired);

// Get all red flags.
router.get('/api/v1/red-flags', (req, res) => {
  const json = (new IncidentController()).getAll('red-flag');
  res.send(json);
});

// Get a specific red flag record.
router.get('/api/v1/red-flags/:id', (req, res) => {
  const json = (new IncidentController()).get('red-flag', req.params.id);
  res.send(json);
});

// Create a red flag record.
router.post('/api/v1/red-flags', (req, res) => {
  const json = (new IncidentController()).add('red-flag', req);
  res.send(json);
});

// Edit a specific red-flag record.
router.patch('/api/v1/red-flags/:id', (req, res) => {
  const json = (new IncidentController()).update('red-flag', req.params.id, req.body);
  res.send(json);
});

// Deletes a specific red flag record.
router.delete('/api/v1/red-flags/:id', (req, res) => {
  const json = (new IncidentController()).delete('red-flag', req.params.id);
  res.send(json);
});

export default router;
