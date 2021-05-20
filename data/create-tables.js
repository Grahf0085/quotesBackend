/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(` 
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        hash TEXT NOT NULL
      );
    
      CREATE TABLE quotes (
        id SERIAL PRIMARY KEY NOT NULL,
        quote TEXT NOT NULL,
        author VARCHAR(128) NOT NULL,
        tags VARCHAR(1024) NOT NULL,
        favorited BOOLEAN DEFAULT FALSE NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );

      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY NOT NULL,
        quote TEXT NOT NULL, 
        author VARCHAR(1024) NOT NULL,
        tags VARCHAR(1024),
        favorited BOOLEAN DEFAULT TRUE NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log('create tables complete');
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}