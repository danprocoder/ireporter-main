'use strict';

import load from '../loader.js';
import Data from '../models/data.js';

const response = load.library('response');
const userData = new Data('user');

export default {
  
  auth: (req, res) => {
	let email = req.body.email,
		password = req.body.password;
    return response.success({'id':200});
  },

  addUser: (req, res) => {
	let id = userData.insert({
		firstname: req.body.firstname.toLowerCase(),
		lastname: req.body.lastname.toLowerCase(),
		email: req.body.email.toLowerCase(),
		mobile: req.body.mobile,
		password: req.body.password,
	});
    return response.success({
		'id': id
	});
  }
}
