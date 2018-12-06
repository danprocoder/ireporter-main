import express from 'express';
import path from 'path';
import apiRouter from './src/routes/api';

const app = express();

app.use(apiRouter);
app.use(express.static(path.join(__dirname, '../UI')));

app.listen(process.env.PORT || 8001, () => {
  console.log('Server started: 8001');
});
