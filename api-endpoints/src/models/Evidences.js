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
}
