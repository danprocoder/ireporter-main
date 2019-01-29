import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/User';
import Validator from '../helpers/validator';
import response from '../helpers/response';

dotenv.config();

export default class {
  constructor() {
    this.model = new UserModel();
  }

  auth(req, res) {
    const rules = {
      email: {
        required: 'Email address is required',
        valid_email: 'Please enter a valid email',
      },
      password: {
        required: 'Password is required',
      },
    };
    const validator = new Validator(req.body);
    if (validator.validate(rules)) {
      const { email, password } = req.body;
      this.model.getByEmail(email, (row) => {
        if (!row) {
          res.status(400).json(response.fail('Email address is not registered'));
        } else {
          bcrypt.compare(password, row.password, (err, success) => {
            if (success === true) {
              res.status(200).json(response.success({
                token: jwt.sign({
                  userId: row.id,
                }, process.env.SECRET_KEY),
                user: {
                  firstname: row.firstname,
                  lastname: row.lastname,
                  username: row.username,
                  email: row.email,
                  phoneNumber: row.phonenumber,
                  isAdmin: row.isadmin,
                },
              }));
            } else {
              res.status(400).json(response.fail('Incorrect password'));
            }
          });
        }
      });
    } else {
      res.status(400).json(response.fail(validator.getErrors()));
    }
  }

  addUser(req, res) {
    const validator = new Validator(req.body);

    const rules = {
      firstname: {
        required: 'Firstname is required',
        alpha: 'Firstname can only contain letters',
      },
      lastname: {
        required: 'Lastname is required',
        alpha: 'Lastname can only contain letters',
      },
      username: {
        required: 'Username is required',
        alpha: 'Username can only contain letters',
      },
      email: {
        required: 'Email is required',
        valid_email: 'Please provide a valid email',
      },
      password: {
        required: 'Password is required',
        'min_length[8]': 'Password should be atleast 8 characters',
      },
      phoneNumber: {
        required: 'Your phone number is required',
        valid_mobile: 'Phone number format is not correct',
      },
    };
    if (validator.validate(rules)) {
      const {
        firstname, lastname, username, email, password, phoneNumber,
      } = req.body;

      this.model.insert({
        firstname,
        lastname,
        username,
        email,
        phoneNumber,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
      }, (row) => {
        const userId = row.id;
        row.id = undefined;
        res.status(200).json(response.success({
          token: jwt.sign({
            userId,
          }, process.env.SECRET_KEY),
          user: row,
        }));
      });
    } else {
      res.status(400).json(response.fail(validator.getErrors()));
    }
  }

  userInfo(req, res) {
    const user = req.loggedInUser;

    res.status(200).json(response.success({
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      phoneNumber: user.phonenumber,
      isAdmin: user.isadmin,
    }));
  }

  getTotalUsers(req, res) {
    this.model.getTotalUsers((count) => {
      res.status(200).json(response.success({
        count
      }));
    });
  }

  getAllUsers(req, res) {
    this.model.getAllUsers((rows) => {
      res.status(200).json(response.success(rows));
    });
  }
}
