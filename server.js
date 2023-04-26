// const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  process.exit(1);
});

// dotenv.config({ path: './config.env' });
const app = require('./app');

require('./db/mongoose');

// mongoose.connect('mongodb://localhost:27017/tour').then(() => console.log('DB connection successfull'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
