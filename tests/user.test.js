const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/userModel');

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
// beforeEach(async () => {
//   await mongoose.connect('mongodb://localhost:27017/tour');
//   // await new User(userOne).save();
// });

/* Closing database connection after each test. */
// afterEach(async () => {
//   await mongoose.connection.close();
// });

test('should signup a new user', async () => {
  //  const response =

  await request(app)
    .post('/signup')
    .send({
      name: 'johnn',
      email: 'john11@gmail.com',
      password: '1234',
      passwordConfirm: '1234',
    })
    .expect(201);
  // const newUser = await User.findById(response.body.data.newUser._id);
  // expect(newUser).not.toBeNull();

  // expect(response.body).toMatchObject({
  //   newUser: {
  //     name: 'john',
  //     email: 'john@gmail.com',
  //     password: 'generality',
  //   },
  // });
});
