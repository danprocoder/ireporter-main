'use strict';

export default {

  success: function(data) {
    return {
      'status': 200,
      'data': data instanceof Array ? data : [data]
    }
  },

  fail: function(message) {
    return {
      'status': 400,
      'error': message
    }
  }
}
