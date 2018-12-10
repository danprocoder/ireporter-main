import express from 'express';
import path from 'path';
import userRouter from './src/routes/users';
import redFlagRouter from './src/routes/red-flags';
import interventionRouter from './src/routes/interventions';

const app = express();
app.use(express.urlencoded());
app.use(express.json());

app.use(userRouter);
app.use(redFlagRouter);
app.use(interventionRouter);
app.use(express.static(path.join(__dirname, '../UI')));

app.listen(process.env.PORT || 8001, () => {
  console.log('Server started: 8001');
});

export default app;
