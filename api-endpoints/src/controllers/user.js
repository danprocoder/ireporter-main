

import load from '../helpers/loader';
import Model from '../models/model';

const response = load.library('response');
const userModel = new Model('user');

export default class {

  auth(req, res) {
    const { email, password } =  req.body;

    const user = userModel.init().where('email', email).first();

    if (user == null) {
      return response.fail('Email address not registered');
    } if (password != user.password) {
      return response.fail('Password is incorrect');
    }
    return response.success();
  },

  addUser(req, res) {
    const { firstname, lastname, email, password, mobile } = req.body;

    const id = userModel.insert({
      firstname,
      lastname,
      email,
      mobile,
      password,
    });
    return response.success({
      id,
    });
  },
};
