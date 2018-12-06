export default class Validator {
  constructor(requestBody) {
    this.requestBody = requestBody;
    this.errors = {};
  }

  validate(rules) {
  	this.errors = {};
    for (const name in rules) {
      const r = rules[name];


      const value = this.requestBody[name];


      const err = this._test(value, r);
      if (err !== true) {
      	this.errors[name] = err;
      }
    }

    return Object.keys(this.errors).length == 0;
  }

  getErrors() {
  	return this.errors;
  }

  /**
   * @return Returns a string if there is an error message or true if there is no error.
   */
  _test(value, rules) {
    for (let i = 0; i < rules.length; i++) {
      const r = rules[i];
      if (r == 'required' && !value) {
      	return 'Field is required';
      } if (/^min_length\[(\d+)\]$/.test(r)) {
      	const length = /min_length\[(\d+)\]/.exec(r)[1];
      	if (value.length < length) {
      	  return `Field should contain atleast ${length} characters`;
      	}
      } else if (r == 'valid_email' && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
      	return 'Valid email is required';
      } else if (r == 'valid_mobile' && !/^(\+?234|0)[0-9]{10}$/.test(value)) {
      	return 'Mobile number not valid';
      }
    }

    return true;
  }
}
