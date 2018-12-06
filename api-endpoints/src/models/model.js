

import fileSystem, { mkdirSync, fstat } from 'fs';
import path from 'path';

class Model {
  constructor(name) {
    this.conditions = {};

    const relPath = path.join(__dirname, '../.data');

    if (!fileSystem.existsSync(relPath)) {
      mkdirSync(relPath);
    }

    this.filePath = path.join(relPath, name);
    if (!fileSystem.existsSync(this.filePath)) {
      fileSystem.writeFileSync(this.filePath, '{}');
      this.data = {};
    } else {
      const data = fileSystem.readFileSync(this.filePath);
      this.data = JSON.parse(data);
    }
  }

  _commit() {
    fileSystem.writeFileSync(this.filePath, JSON.stringify(this.data));
  }

  init() {
    this.conditions = {};
    return this;
  }

  insert(data) {
    const id = Object.keys(this.data).length + 1;
    data['id'] = id;
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
    const data = []; let
      numRows = 0;
    for (const id in this.data) {
      let pass = true;
      for (const field in this.conditions) {
        if (this.data[id][field] != this.conditions[field]) {
          pass = false;
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
}

export default Model;
