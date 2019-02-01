import escape from 'pg-escape';
import db from '../database/database';

export default class Evidences {
  constructor() {
    this.table = 'evidences';
  }

  addEvidences(id, url, callback) {
    let sql = `INSERT INTO ${this.table}(incidentid, url)VALUES(%L, %L)`;
    db.query(escape(sql, id.toString(), url.toString()), (err, res) => {
      if (!err) {
        callback();
      }
    });
  }

  getEvidences(id, callback) {
    const sql = escape(`SELECT url FROM ${this.table} WHERE incidentid=%L`, id);
    db.query(sql, (err, res) => {
      if (!err) {
        callback(res.rows);
      }
    });
  }
}
