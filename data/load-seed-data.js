/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import unmungedQuotes from './quotes.js';
import { formattedQuotes } from '../lib/utils.js';

const quotes = formattedQuotes(unmungedQuotes);

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, hash)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
        [user.name, user.email, user.password]);
      })
    );
    
    const user = data[0].rows[0];

    await Promise.all(
      quotes.map(quote => {
        return client.query(`
        INSERT INTO quotes (quote, author, tags, favorited, user_id)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [quote.quote, quote.author, quote.tags, quote.favorited, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}