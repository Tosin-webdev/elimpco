const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose.connect('mongodb://localhost/tour').then(() => console.log('DB connection successfull'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// const connectDB = async () => {
//   try {
//     // mongodb connection string
//     const con = await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`mongoDB connected: ${con.connection.host}`);
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };
// connectDB();

// process.on('unhandledRejection', (err) => {
//   console.log(err);
//   console.log('UNHANDLED REJECTION! shuttiing down...');
//   server.close(() => {
//     process.exit(1);
//   });
// });
