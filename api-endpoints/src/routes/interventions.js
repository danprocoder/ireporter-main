import express from 'express';
import IncidentController from '../controllers/Incident';
import verifyJwtToken from '../middlewares/verifyJwtToken';
import loginRequired from '../middlewares/loginRequired';
import adminRequired from '../middlewares/adminRequired';

const router = express.Router();
router.use(verifyJwtToken, loginRequired);

// Get all interventions.
router.get('/api/v1/interventions', (req, res) => {
  const json = (new IncidentController()).getAll('intervention');
  res.send(json);
});

// Get a specific intervention record.
router.get('/api/v1/interventions/:id', (req, res) => {
  const json = (new IncidentController()).get('intervention', req.params.id);
  res.send(json);
});

// Create an intervention record.
router.post('/api/v1/interventions', (req, res) => {
  const json = (new IncidentController()).add('intervention', req);
  res.send(json);
});

// Edit a specific intervention record.
router.patch('/api/v1/interventions/:id', (req, res) => {
  const json = (new IncidentController()).update('intervention', req.params.id, req.body);
  res.send(json);
});

// Deletes a specific intervention record.
router.delete('/api/v1/interventions/:id', (req, res) => {
  const json = (new IncidentController()).delete('intervention', req.params.id);
  res.send(json);
});

export default router;
