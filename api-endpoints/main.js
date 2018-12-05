import express from 'express';
import path from 'path';
import apiRouter from './src/routes/api.js';

const app = express();

app.use(apiRouter);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

const server = app.listen(8001, () => {
  console.log('Server started :8001');
});
