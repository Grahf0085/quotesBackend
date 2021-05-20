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

  let user;

  beforeAll(async () => {
    execSync('npm run recreate-tables');

    const response = await request
      .post('/api/auth/signup')
      .send({
        name: 'Quote Lover',
        email: 'lover@quotes.com',
        password: 'sekritquotes'
      });

    expect(response.status).toBe(200);

    user = response.body;
  });


  const expectedQuote = {
    quote: expect.anything(),
    author: expect.anything(),
    tags: [expect.anything()],
    favorited: false
  };
   
  it('test format function', async () => {
    const result = formattedQuotes(quotes);
    expect(expectedQuote).toEqual(result[0]);

  });
});
