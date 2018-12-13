import db from '../database/database';

// Create users table.
db.query(
  `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    username VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(256) NOT NULL,
    phonenumber VARCHAR(16) NOT NULL,
    isadmin BOOLEAN NOT NULL DEFAULT false
  );`, (err, res) => {
    if (err) {
      console.log('Failed to create `users` table.');
    } else {
      console.log('Table `users` created successfully.');
    }

    // Create admin user.
    db.query(`INSERT INTO users(
        firstname, lastname, username, email, password, phonenumber, isadmin)
      VALUES(
        'Web', 'Admin', 'webadmin', 'webadmin@ireporter.com', 'webadmin123', '+2348123435333', TRUE
      )`, (err, res) => {
      if (!err) {
        console.log('User `Web Admin` created successfully');
      }

      // Create incident tables.
      db.query(
        `CREATE TABLE incidents (
            id SERIAL PRIMARY KEY,
            createdon TIMESTAMP DEFAULT NOW(),
            createdby INTEGER NOT NULL REFERENCES users(id),
            type VARCHAR(20) NOT NULL,
            title VARCHAR(200) NOT NULL,
            comment TEXT NOT NULL,
            status VARCHAR(30) NOT NULL DEFAULT 'in-draft',
            latitude VARCHAR(15),
            longitude VARCHAR(15)
          );`, (err, res) => {
          if (!err) {
            console.log('Table `incidents` created successfully');
          } else {
            console.log('Failed to create `incidents` table');
          }

          process.exit();
        },
      );
    });
  },
);
