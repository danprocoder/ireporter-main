import path from 'path';

export default {

  controller(name) {
    return this._getObject('controllers', name);
  },

  library(name) {
    return this._getObject('libraries', name);
  },

  _getObject(folder, name) {
    return require(path.join(__dirname, `${folder}/${name}.js`)).default;
  },
};
