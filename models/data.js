'use strict';

import fileSystem, { mkdirSync, fstat } from 'fs';
import path from 'path';

class Data {
  constructor(name) {
    this.conditions = {};

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

  init() {
    this.conditions = {};
    return this;
  }

  insert(data) {
    let id = Object.keys(this.data).length + 1;
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

  get() {
    let data = [], numRows = 0;
    for (let id in this.data) {
        let pass = true;
        for (let field in this.conditions) {
            console.log(this.data[id][field]);
            console.log(this.conditions[field]);
            if (this.data[id][field] != this.conditions[field]) {
                pass = false;console.log('breaking');
                break;
            }
        }

        if (pass) {
            data.push(this.data[id]);
            numRows++;
        }
    }
    return data;
  }

  first() {
    return this.get()[0] || null;
  }

  where(field, value) {
    this.conditions[field] = value;
    return this;
  }

  _commit() {
    fileSystem.writeFileSync(this.filePath, JSON.stringify(this.data));
  }
}

export default Data;