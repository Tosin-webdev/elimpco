const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/userModel');

beforeEach(async () => {
  await mongoose.connect('mongodb://localhost:27017/tour');
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

test('should signup a new user', async () => {
  const response = await request(app)
    .post('/api/v1/user/signup')
    .send({
      firstName: 'john',
      lastName: 'bull',
      email: 'john@gmail.com',
      password: 'generality',
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      firstName: 'david',
      lastName: 'bull',
      email: 'john@gmail.com',
    },
  });
});
