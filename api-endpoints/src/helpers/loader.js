import path from 'path';

export default {
	
	controller: function(name) {
		return this._getObject('controllers', name);
	},

	library: function(name) {
		return this._getObject('libraries', name);
	},

	_getObject: function(folder, name) {
		return require(path.join(__dirname, `${folder}/${name}.js`)).default;
	}
}
