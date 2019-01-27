import escape from 'pg-escape';
import db from '../database/database';

export default class {
  insert(data, callback) {
    const sql = escape(
      `INSERT INTO users(
        firstname, lastname, username, password, email, phonenumber
      )VALUES(%L, %L, %L, %L, %L, %L)
      RETURNING id, firstname, lastname, username, email, phonenumber`,
      data.firstname,
      data.lastname,
      data.username,
      data.password,
      data.email,
      data.phoneNumber,
    );
    db.query(sql, (err, res) => {
      if (!err) {
        callback.call(this, res.rows[0]);
      }
    });
  }

  getById(id, callback) {
    const sql = escape('SELECT * FROM users WHERE id=%L LIMIT 1', id.toString());
    db.query(sql, (err, res) => {
      if (!err) {
        callback(res.rows[0] || null);
      }
    });
  }

  getByEmail(email, callback) {
    const sql = escape('SELECT * FROM users WHERE email=%L LIMIT 1', email);
    db.query(sql, (err, res) => {
      if (!err) {
        callback(res.rows[0] || null);
      }
    });
  }

  getTotalUsers(callback) {
    const sql = escape('SELECT COUNT(id) FROM users WHERE isadmin=False');
    db.query(sql, (err, res) => {
      if (!err) {
        callback(parseInt(res.rows[0].count));
      }
    });
  }

  getAllUsers(callback) {
    const sql = escape('SELECT firstname, lastname, username, email, phonenumber FROM users WHERE isadmin=False');
    db.query(sql, (err, res) => {
      if (!err) {
        callback(res.rows);
      }
    });
  }
}
