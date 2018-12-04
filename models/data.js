'use strict';

import fileSystem, { mkdirSync, fstat } from 'fs';
import path from 'path';

class Data {
  constructor(name) {
    var relPath = path.join(__dirname, 'data');

    if (!fileSystem.existsSync(relPath)) {
      mkdirSync(relPath);
    }

    var filePath = path.join(relPath, name);
    if (!fileSystem.existsSync(filePath)) {
        fileSystem.writeFileSync(filePath, '{}');
        this.data = {};
    } else {
        let data = fileSystem.readFileSync(filePath);
        this.data = JSON.parse(data);
    }
  }

  insert(data) {
    let id = this.data.keys().length + 1;
    this.data[id] = data;
    return id;
  }

  update() {

  }

  delete(id) {

  }

  getAll() {

  }

  get(id) {

  }
}

export default Data;