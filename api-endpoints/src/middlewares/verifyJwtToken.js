import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import response from '../helpers/response';

dotenv.config();

export default (req, res, next) => {
  const jwtToken = req.headers['x-access-token'];
  if (jwtToken) {
    jwt.verify(jwtToken, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(400).json(response.fail('Invalid token supplied'));
      } else {
        req.jwtPayload = decoded;
        next();
      }
    });
  } else {
    res.status(400).json(response.fail('Token required'));
  }
}
