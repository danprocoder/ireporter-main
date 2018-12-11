import jwt from 'jsonwebtoken';
import config from '../../config';
import response from '../helpers/response';

export default (req, res, next) => {
  const jwtToken = req.headers['x-access-token'];
  if (jwtToken) {
    jwt.verify(jwtToken, config.jwt.secret, (err, decoded) => {
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
