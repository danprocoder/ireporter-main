import supertest from 'supertest';
import chai from 'chai';
import app from '../main';

const { expect } = chai;

describe('API endpoints tests', () => {
  let userId = null;
  let token = null;

  describe('POST /api/v1/auth/signup', () => {
    const userData = {
      firstname: 'Test',
      lastname: 'User',
      username: 'testuser',
      password: 'testuser101',
      email: 'testuser@gmail.com',
      phoneNumber: '+2348085321223',
    };
    it('should add a new user', (done) => {
      supertest(app).post('/api/v1/auth/signup').send(userData).end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data.length).to.equal(1);

        userId = res.body.data[0].id;

        done();
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should log the user in using the detail used to authenticate the user', (done) => {
      supertest(app).post('/api/v1/auth/login').send({
        email: 'testuser@gmail.com',
        password: 'testuser101',
      }).end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data.length).to.equal(1);

        token = res.body.data[0].token;

        done();
      });
    });
  });

  let adminToken = null;

  describe('GET /api/v1/admin/users/count', () => {

    it('should return admin token', (done) => {
      supertest(app).post('/api/v1/auth/login').send({
        email: 'webadmin@ireporter.com',
        password: 'webadmin123',
      }).end((err, res) => {
        adminToken = res.body.data[0].token;

        done();
      });
    });

    it('should return the total number of users. It should be at least 1', (done) => {
      supertest(app).get('/api/v1/admin/users/count').set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          expect(res.body.data.length).to.equal(1);
          expect(res.body.data[0].count).to.be.at.least(1);

          done();
        });
    });
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return all users registered on the platform', (done) => {
      supertest(app).get('/api/v1/admin/users').set('x-access-token', adminToken)
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          expect(res.body.data.length).to.be.at.least(1);

          done();
        });
    });
  });

  let recordId = null;

  // Create a new red flag record.
  describe('# Insert a new red-flag', () => {
    it('should insert a new red-flag record', (done) => {
      supertest(app).post('/api/v1/red-flags').set('x-access-token', token).send({
        title: 'Snake ate #10m',
        comment: 'A funny news heard A funny news heard A funny news heard A funny news heard',
        lat: 78,
        long: 130,
      })
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          expect(res.body.data.length).equal(1);
          expect(res.body.data[0].message).equal('Created red-flag record');
          recordId = res.body.data[0].id;
          done();
        });
    });

    it('should select the newly created red-flag record', (done) => {
      supertest(app).get(`/api/v1/red-flags/${recordId}`).set('x-access-token', token).end((err, res) => {
        expect(res.body.status).equal(200);
        done();
      });
    });
  });

  // Get all red flag records
  describe('# Get all red flag records', () => {
    it('should select an array containing 1 red flag record', (done) => {
      supertest(app).get('/api/v1/red-flags').set('x-access-token', token).end((err, res) => {
        expect(res.body.data.length).to.be.at.least(1);
        done();
      });
    });
  });

  // Get red flag stats
  describe('# Get all red flag stats', () => {
    it ('should return red-flag stats for the particular user', (done) => {
      supertest(app).get('/api/v1/red-flags/stats').set('x-access-token', token).end((err, res) => {
        expect(res.body.status).to.equal(200);
        done();
      });
    });
  });

  // Edit the created red flag record.
  describe('# Edit the created red flag record', () => {
    it('should edit the title of the created red-flag record', (done) => {
      supertest(app).patch(`/api/v1/red-flags/${recordId}`).set('x-access-token', token).send({
        title: 'new title',
        comment: 'new comment new comment new comment new comment new comment new comment',
        lat: null,
        long: null,
      })
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          expect(res.body.data.length).equal(1);
          done();
        });
    });
  });

  // Get editted red flag record
  describe('# Confirm record was really editted', () => {
    it('should show title as \'new title\' and comment as \'new comment new comment new comment new comment new comment new comment\'', (done) => {
      supertest(app).get(`/api/v1/red-flags/${recordId}`).set('x-access-token', token).end((err, res) => {
        expect(res.body.status).equal(200);
        expect(res.body.data[0].title).equal('new title');
        expect(res.body.data[0].comment).equal('new comment new comment new comment new comment new comment new comment');
        done();
      });
    });
  });

  // Delete the created red flag record.
  describe('DELETE /api/v1/red-flags/:id', () => {
    it('should delete the created record', (done) => {
      supertest(app).delete(`/api/v1/red-flags/${recordId}`).set('x-access-token', token).end((err, res) => {
        expect(res.body.status).equal(200);
        expect(res.body.data.length).equal(1);
        done();
      });
    });

    it('should return status 404 when trying to fetch using the same id that was deleted', (done) => {
      supertest(app).get(`/api/v1/red-flags/${recordId}`).set('x-access-token', token).end((err, res) => {
        expect(res.body.status).equal(404);
        done();
      });
    });
  });
});
