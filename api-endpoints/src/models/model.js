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

  _getWhere(callback=null) {
    const data = [];
    for (const id in this.data) {
      let pass = false;

      for (const field in this.conditions) {
        if (this.conditions[field] != this.data[id][field]) {
          pass = true;
          break;
        }
      }

      if (!pass) {
        data.push(this.data[id]);
        if (typeof callback == 'function') {
          callback.call(this, this.data[id]);
        }
      }
    }
    return data;
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

  update(data) {
    this._getWhere((record) => {
      for (const k in data) {
        this.data[record.id][k] = data[k];
      }
    });
    this._commit();
  }

  delete() {
    this._getWhere((record) => {
      delete this.data[record.id];
    });
    this._commit();
  }

  getAll() {
    return this.data;
  }

  get() {
    return this._getWhere();
  }

  first() {
    return this._getWhere()[0] || null;
  }

  where(field, value) {
    this.conditions[field] = value;
    return this;
  }
}

export default Model;
