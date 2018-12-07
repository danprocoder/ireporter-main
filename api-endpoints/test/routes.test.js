import supertest from 'supertest';
import app from '../main.js';
import chai from 'chai';

const expect = chai.expect;

describe('API tests', () => {
  let recordId = null;
  
  // Create a new red flag record.
  describe('# Insert a new red-flag', () => {
    it('should insert a new red-flag record', (done) => {
      supertest(app).post('/api/v1/red-flags').send({
        title: 'Snake ate #10m',
        comment: 'A funny news heard A funny news heard A funny news heard A funny news heard',
        lat: 78,
        long: 130
      }).end((err, res) => {
        expect(res.body.status).to.equal(200);
        recordId = res.body.data[0].id;
        done();
      });
    });

    it('should select the newly created red-flag record', (done) => {
      supertest(app).get('/api/v1/red-flags/' + recordId).end((err, res) => {
        expect(res.body.status).equal(200);
        done();
      });
    });
  });

  // Get all red flag records
  describe('# Get all red flag records', () => {
    it('should select an array containing 1 red flag record', (done) => {
      supertest(app).get('/api/v1/red-flags').end((err, res) => {
        expect(res.body.data.length).to.be.above(1);
        done();
      });
    })
  });

  // Edit the created red flag record.
  describe('# Edit the created red flag record', () => {
    it('should edit the title of the created red-flag record', (done) => {
      supertest(app).patch('/api/v1/red-flags/' + recordId).send({
        title: 'new title',
        comment: 'new comment new comment new comment new comment new comment new comment',
        lat: null,
        long: null
      }).end((err, res) => {
        expect(res.body.status).to.equal(200);
        done();
      });
    });
  });

  // Get editted red flag record
  describe('# Confirm record was really editted', () => {
    it('should show title as \'new title\' and comment as \'new comment new comment new comment new comment new comment new comment\'', (done) => {
      supertest(app).get('/api/v1/red-flags/' + recordId).end((err, res) => {
        expect(res.body.status).equal(200);
        expect(res.body.data[0].title).equal('new title');
        expect(res.body.data[0].comment).equal('new comment new comment new comment new comment new comment new comment');
        done();
      });
    });
  });

  // Delete the created red flag record.
  describe('# Finally delete the red-flag record', () => {
    it('should delete the created record', (done) => {
      supertest(app).delete('/api/v1/red-flags/' + recordId).end((err, res) => {
        expect(res.body.status).equal(200);
        done();
      });
    });

    it('should return status 404', (done) => {
      supertest(app).get('/api/v1/red-flags/' + recordId).end((err, res) => {
        expect(res.body.status).equal(400);
        done();
      });
    });
  });
});
