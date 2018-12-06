

import load from '../helpers/loader';
import Model from '../models/model';
import Validator from '../helpers/validator';
import response from '../helpers/response';

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
  }

  addUser(req, res) {
    const validator = new Validator(req.body);
    const rules = {
      firstname: ['required'],
      lastname: ['required'],
      email: ['required', 'email', 'valid_email'],
      password: ['required', 'min_length[8]'],
      mobile: ['required', 'valid_mobile']
    };
    if (validator.validate(rules)) {
      const { firstname, lastname, email, password, mobile } = req.body;

      const id = userModel.insert({
        firstname,
        lastname,
        email,
        phoneNumber: mobile,
        password,
        registered: new Date(),
        isAdmin: false
      });
      return response.success({
        id,
      });
    } else {
      return response.fail(validator.getErrors());
    }
  }
};
