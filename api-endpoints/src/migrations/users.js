import db from '../database/database';

db.query(
  `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    username VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(256) NOT NULL,
    phonenumber VARCHAR(16) NOT NULL
  );`, (err, res) => {
    if (err) {
      console.log('Failed to create users table.');
    } else {
      console.log('Table users created successfully.');
    }
  },
);
