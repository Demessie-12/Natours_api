const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // read variable from file and seve them on node.js enviromental variable

// lecture 119 uncaught exceptions
// uncaught exceptions are all errors in synchronous code which doesn't handeled anywhere
process.on('uncaughtException', (err) => {
  console.log(err.name, 'detail:-', err.message);
  console.log('UNCAUGHT EXCEPTIONS! shuting down......');
  process.exit(1);
});

const app = require('./app');

// console.log(process.env);
// const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = 3000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});

// lecture 118 unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, 'detail:-', err.message);
  console.log('UNHANDLED REJECTION! shuting down......');
  server.close(() => {
    process.exit(1);
  });
});
