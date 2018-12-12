import escape from 'pg-escape';
import db from '../database/database';

export default class IncidentModel {
  insert(data, callback) {
    const sql = escape('INSERT INTO incidents(createdby, type, title, comment, latitude, longitude)VALUES(%L, %L, %L, %L, %L, %L) RETURNING id',
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
}
