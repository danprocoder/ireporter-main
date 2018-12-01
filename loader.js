module.exports = {
	controller: function(name) {
		return require(path.join(__dirname, `controllers/${name}.js`));
	},

	library: function(name) {
		return require(path.join(__dirname, `libraries/${name}.js`));
	}
}
