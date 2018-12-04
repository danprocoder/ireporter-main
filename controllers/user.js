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
	let firstname = req.body.firstname,
		lastname = req.body.lastname,
		email = req.body.email,
		password = req.body.password;
    return response.success({'id':200});
  }
}
