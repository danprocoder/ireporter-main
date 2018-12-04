'use strict';

import load from '../loader.js';
import Data from '../models/data.js';

const response = load.library('response');
const userData = new Data('user');

export default {
  
  auth: (req, res) => {
	let email = req.body.email,
		password = req.body.password,
		user = userData.init().where('email', email).first();
		console.log(user);
	if (user == null) {
      return response.fail('Email address not registered');
	} else if (password != user.password) {
		return response.fail('Password is incorrect');
	} else {
		return response.success();
	}
  },

  addUser: (req, res) => {
	let firstname = req.body.firstname,
		lastname = req.body.lastname,
		email = req.body.email,
		password = req.body.password,
		mobile = req.body.mobile;

	let id = userData.insert({
		firstname,
		lastname,
		email,
		mobile,
		password
	});
    return response.success({
		'id': id
	});
  }
}
