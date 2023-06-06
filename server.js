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

// connect to local database
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));
/*
//  Connect with mongodb atlas
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/

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
