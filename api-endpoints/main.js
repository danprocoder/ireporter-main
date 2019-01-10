import express from 'express';
import path from 'path';
import userRouter from './src/routes/users';
import redFlagRouter from './src/routes/red-flags';
import interventionRouter from './src/routes/interventions';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://danprocoder.github.io');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(express.urlencoded({
  extended: false,
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../UI')));

app.use(userRouter);
app.use(redFlagRouter);
app.use(interventionRouter);

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;
