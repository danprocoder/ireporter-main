import path from 'path';

export default {
  controller(name) {
  	const controllerClass = this._getObject('controllers', name);
    return new controllerClass();
  },

  library(name) {
    return this._getObject('helpers', name);
  },

  _getObject(folder, name) {
    return require(path.join(__dirname, `../${folder}/${name}.js`)).default;
  },
};
