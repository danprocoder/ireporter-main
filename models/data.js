'use strict';

import fileSystem, { mkdirSync, fstat } from 'fs';
import path from 'path';

class Data {
  constructor(name) {
    let relPath = path.join(__dirname, 'data');

    if (!fileSystem.existsSync(relPath)) {
      mkdirSync(relPath);
    }

    this.filePath = path.join(relPath, name);
    if (!fileSystem.existsSync(this.filePath)) {
        fileSystem.writeFileSync(this.filePath, '{}');
        this.data = {};
    } else {
        let data = fileSystem.readFileSync(this.filePath);
        this.data = JSON.parse(data);
    }
  }

  insert(data) {
    let id = this.data.keys().length + 1;
    this.data[id] = data;
    this._commit();
    return id;
  }

  update(id, data) {
    this.data[id] = data;
    this._commit();
  }

  delete(id) {
    delete this.data[id];
    this._commit();
  }

  getAll() {
    return this.data;
  }

  get(id) {
    return this.data[id];
  }

  _commit() {
    fileSystem.writeFileSync(this.filePath, JSON.stringify(this.data));
  }
}

export default Data;