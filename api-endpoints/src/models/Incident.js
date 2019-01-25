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
      data.latitude ? data.latitude.toString() : null,
      data.longitude ? data.longitude.toString() : null);
    db.query(sql, (err, res) => {
      if (!err) {
        callback(res.rows[0] || null);
      }
    });
  }

  update(type, id, data, callback) {
    const sql = escape(`UPDATE ${this.table} SET title=%L, comment=%L, latitude=%L, longitude=%L WHERE type=%L AND id=%L`,
      data.title,
      data.comment,
      data.latitude ? data.latitude.toString() : null,
      data.longitude ? data.longitude.toString() : null,
      type,
      id.toString());
    db.query(sql, (err, res) => {
      if (!err) {
        callback();
      }
    });
  }

  updateStatus(type, id, status, callback) {
    const sql = escape(`UPDATE ${this.table} SET status=%L WHERE type=%L AND id=%L`, status, type, id);
    db.query(sql, (err, res) => {
      callback(!err);
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

  readOneById(type, id, callback) {
    const sql = escape(`SELECT * FROM ${this.table} WHERE type=%L AND id=%L LIMIT 1`, type, id.toString());
    db.query(sql, (err, res) => {
      if (!err) {
        callback(res.rows[0] || null);
      }
    });
  }

  deleteById(type, id, callback) {
    const sql = escape(`DELETE FROM ${this.table} WHERE type=%L AND id=%L`, type, id.toString());
    db.query(sql, (err, res) => {
      if (!err) {
        callback();
      }
    });
  }
}
