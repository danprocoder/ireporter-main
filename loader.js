import path from 'path';

class Loader {
	
	controller(name) {
		return require(path.join(__dirname, `controllers/${name}.js`));
	}

	library(name) {
		return require(path.join(__dirname, `libraries/${name}.js`));
	}
}

export default Loader;
