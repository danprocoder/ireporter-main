import escape from 'pg-escape';
import db from '../database/database';

export default class {
  insert(data, callback) {
    const sql = escape(
      `INSERT INTO users(
        firstname, lastname, username, password, email, phoneNumber
      )VALUES(%L, %L, %L, %L, %L, %L)
      RETURNING id, firstname, lastname, username, email, phoneNumber`,
      data.firstname,
      data.lastname,
      data.username,
      data.password,
      data.email,
      data.phoneNumber,
    );
    const userId = null;
    db.query(sql, (err, res) => {
      if (!err) {
        callback.call(this, res.rows[0]);
      }
    });
  }

  getById() {

  }

  getByEmail(email) {

  }
}
