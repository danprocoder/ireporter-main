import escape from 'pg-escape';
import db from '../database/database';

export default class IncidentModel {
  constructor() {
    this.table = 'incidents';
  }

  insert(data, callback) {
    const sql = escape(`INSERT INTO ${this.table}(createdby, type, title, comment, latitude, longitude)VALUES(%L, %L, %L, %L, %L, %L) RETURNING id`,
      data.createdBy.toString(),
      data.type,
      data.title,
      data.comment,
      data.latitude,
      data.longitude);
    db.query(sql, (err, res) => {
      if (!err) {
        callback(res.rows[0] || null);
      }
    });
  }

  read(type, filters, callback) {
    let sql = `SELECT * FROM ${this.table} WHERE type=%L`;
    const params = [type];
    // Handle filters.
    if (filters.createdBy) {
      sql += ' AND createdby=%L';
      params.push(filters.createdBy.toString());
    }
    params.unshift(sql);
    sql = escape(...params);
    db.query(sql, (err, res) => {
      if (!err) {
        callback(res.rows);
      }
    });
  }
}
