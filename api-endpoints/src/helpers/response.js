export default {
  success(data) {
    return {
      status: 200,
      data: data instanceof Array ? data : [data],
    };
  },

  fail(message) {
    return {
      status: 400,
      error: message,
    };
  },

  notFound(message) {
    return {
      status: 404,
      error: message,
    };
  },
};
