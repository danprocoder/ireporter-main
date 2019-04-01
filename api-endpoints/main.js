import express from 'express';
import path from 'path';
import userRouter from './src/routes/users';
import redFlagRouter from './src/routes/red-flags';
import interventionRouter from './src/routes/interventions';
import adminRouter from './src/routes/admin';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use((req, res, next) => {
  const allowed = process.env.ALLOWED_ORIGINS.split(',');
  allowed.map(origin => origin.toString().trim());
  
  const origin = req.headers.origin;

  if (allowed.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', '*');
  }
  
  // Handle preflight requests.
  if (req.method == 'OPTIONS') {
  	res.send(200);
  } else {
    next();
  }
});

app.use(express.urlencoded({
  extended: false,
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../UI')));

app.use(userRouter);
app.use(redFlagRouter);
app.use(interventionRouter);
app.use(adminRouter);

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;
