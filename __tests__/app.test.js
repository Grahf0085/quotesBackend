import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';
import { formattedQuotes } from '../lib/utils.js';
import  quotes from '../data/quotes.js';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/quotes', () => {
    // let user;

    // beforeAll(async () => {
    //   execSync('npm run recreate-tables');

    //   const response = await request
    //     .post('/api/auth/signup')
    //     .send({
    //       name: 'Me the User',
    //       email: 'me@user.com',
    //       password: 'password'
    //     });

    //   expect(response.status).toBe(200);

    //   user = response.body;
    // });

    // append the token to your requests:
    //  .set('Authorization', user.token);
    const quote = {
      quote: 'What\'s important at the grocery store is just as important in engines or medical systems. If the customer isn\'t satisfied, if the stuff is getting stale, if the shelf isn\'t right, or if the offerings aren\'t right, it\'s the same thing. You manage it like a small organization. You don\'t get hung up on zeros.',
      author: 'Jack Welch',
      tags: ['medical'],
      favorited: false
    };
   
    it('munges quote data', async () => {
      const output = formattedQuotes(quotes.quotes);
      
      expect(output).toEqual(quote);
    });

  });
});