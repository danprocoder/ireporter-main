import path from 'path';

export default {

  controller(name) {
    return new this._getObject('controllers', name)();
  },

  library(name) {
    return this._getObject('libraries', name);
  },

  _getObject(folder, name) {
    return new require(path.join(__dirname, `${folder}/${name}.js`)).default;
  },
};
