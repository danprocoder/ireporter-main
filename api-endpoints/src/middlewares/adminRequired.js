import response from '../helpers/response';

export default (req, res, next) => {
  if (!req.loggedInUser.isadmin) {
    res.status(403).json(response.fail('User must be an admin'));
  } else {
    next();
  }
};
