import UserModel from '../models/User';
import response from '../helpers/response';

export default (req, res, next) => {
  const userId = req.jwtPayload.userId || null;
  if (userId) {
    (new UserModel()).getById(userId, (row) => {
      if (!row) {
        res.status(400).json(response.fail('User doesn\'t exists'));
      } else {
        req.loggedInUser = row;
        next();
      }
    });
  } else {
    res.status(400).json(response.fail('Login required'));
  }
};
