require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../server');
const Note = require('../models/note');

const mockUserId = new mongoose.Types.ObjectId();
const userPayload = { id: mockUserId.toString() };
const token = `Bearer ${jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' })}`;

describe('Note Routes', function () {
  this.timeout(5000);
  let noteId;

  before(async function () {
    try {
      await Note.deleteMany({ user: mockUserId });
    } catch (err) {
      console.error('Error in cleanup:', err);
    }
  });

  it('should create a new note', async function () {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', token)
      .send({
        title: 'Test Note',
        content: 'Test content',
        status: 'draft',
        favorite: false
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'Test Note');
    noteId = res.body._id;
    console.log("Created note with ID:", noteId);
  });

  it('should fetch all notes for the user', async function () {
    const res = await request(app)
      .get('/api/notes/getNotes')
      .set('Authorization', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
  });

  it('should update a note', async function () {
    if (!noteId) this.skip();

    console.log("Updating note with ID:", noteId);
    const res = await request(app)
      .put(`/api/notes/update/${noteId}`)
      .set('Authorization', token)
      .send({
        title: 'Updated Note',
        content: 'Updated content',
        status: 'saved', // ✅ valid value
        favorite: true
      });

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('Updated Note');
  });

  it('should update status of a note', async function () {
    if (!noteId) this.skip();

    console.log("Updating status for note ID:", noteId);
    const res = await request(app)
      .patch(`/api/notes/status/${noteId}`)
      .set('Authorization', token)
      .send({ status: 'saved' }); 

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'saved');
  });

  it('should update favorite of a note', async function () {
    if (!noteId) this.skip();

    console.log("Updating favorite for note ID:", noteId);
    const res = await request(app)
      .patch(`/api/notes/favorite/${noteId}`)
      .set('Authorization', token)
      .set('Content-Type', 'application/json')
      .send({ favorite: true });

    console.log("Response status:", res.status);
    console.log("Response body:", res.body);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('favorite', true);
  });

  it('should delete a note', async function () {
    if (!noteId) this.skip();

    console.log("Deleting note with ID:", noteId);
    const res = await request(app)
      .delete(`/api/notes/delete/${noteId}`)
      .set('Authorization', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Note deleted successfully');
  });

  it('should not allow access without token', async function () {
    const res = await request(app)
      .get('/api/notes/getNotes');

    expect(res.status).to.be.oneOf([401, 403]);
  });

  after(async function () {
    try {
      await Note.deleteMany({ user: mockUserId });
      // Optional: await mongoose.disconnect();
    } catch (err) {
      console.error('Error in cleanup:', err);
    }
  });
});
