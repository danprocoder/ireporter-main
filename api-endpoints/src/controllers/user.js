import UserModel from '../models/User';
import Validator from '../helpers/validator';
import response from '../helpers/response';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

export default class {
  constructor() {
    this.model = new UserModel();
  }

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
      firstname: {
        required: 'Firstname is required',
        alpha: 'Firstname can only contain letters'
      },
      lastname: {
        required: 'Lastname is required',
        alpha: 'Lastname can only contain letters'
      },
      username: {
        required: 'Username is required',
        alpha: 'Username can only contain letters'
      },
      email: {
        required: 'Email is required',
        valid_email: 'Please provide a valid email'
      },
      password: {
        required: 'Password is required',
        'min_length[8]': 'Password should be atleast 8 characters'
      },
      phoneNumber: {
        required: 'Your phone number is required',
        valid_mobile: 'Phone number format is not correct'
      }
    };
    if (validator.validate(rules)) {
      const { firstname, lastname, username, email, password, phoneNumber } = req.body;

      this.model.insert({
        firstname,
        lastname,
        username,
        email,
        phoneNumber,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync())
      }, (row) => {
        const userId = row.id;
        row.id = undefined;
        res.status(200).json(response.success({
          'token': jwt.sign({
            'id': userId
          }, config.jwt.secret),
          'user': row
        }));
      });
    } else {
      res.status(400).json(response.fail(validator.getErrors()));
    }
  }
};
