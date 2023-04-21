const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'blackcypher',
  email: 'blackcypher@gmail.com',
  password: 'comeonboys',
  passwordConfirm: 'comeonboys',
};

beforeEach(async () => {
  await mongoose.connect('mongodb://localhost:27017/tour-test');
  await User.deleteMany();

  await new User(userOne).save();
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

test('should signup a new user', async () => {
  const response = await request(app)
    .post('/api/v1/users/signup')
    .send({
      name: 'john',
      email: 'john11@gmail.com',
      password: '1234',
      passwordConfirm: '1234',
    })
    .expect(201);
  // console.log(response.body);
  const newUser = await User.findById(response.body.data.user._id);
  expect(newUser).not.toBeNull();

  expect(response.body.data).toMatchObject({
    user: {
      name: 'john',
      email: 'john11@gmail.com',
      photo: 'default.jpg',
      backgroundImage: 'default2.jpg',
      role: 'user',
      active: true,
    },
  });
});

test('Should login existing user', async () => {
  // const response =
  await request(app).post('/api/v1/users/login').send({ email: userOne.email, password: userOne.password }).expect(200);

  // expect(response.body.token).toBe(user.token[1].token);
});
