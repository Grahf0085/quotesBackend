import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';
import { formattedQuotes } from '../lib/utils.js';
import quotes from '../data/quotes.js';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('favorites', () => {
    let user;
    let user2;

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
      
      const response2 = await request
        .post('/api/auth/signup')
        .send({
          name: 'Other User',
          email: 'you@user.com',
          password: 'password'
        });

      expect(response2.status).toBe(200);

      user2 = response2.body;

    });

    let favorite = {  // fill in!!!!!!!!!!!!!!!!!!!!!
      id: expect.any(Number),
      quote: expect.anything(),
      author: expect.anything(),
      tags: expect.anything(),
      favorited: true
    };


    it('POST favorite to /api/favorites', async () => {

      const response = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favorite);
      // console.log(favorite);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...favorite,
        userId: user.id
      });

      favorite = response.body;

    });

    it('GET my /api/me/favorites only returns my favorites', async () => {
      // this is setup so that there is a favorite belong to someone else in the db
      const otherResponse = await request
        .post('/api/favorites')
        .set('Authorization', user2.token)
        .send({
          quote: expect.anything(), //FILL IN!!!!!!!!!!!!
          author: expect.anything(),
          tags: expect.anything(),
          favorited: true
        });

      expect(otherResponse.status).toBe(200);
      const otherFavorite = otherResponse.body;

      // we are testing this
      const response = await request.get('/api/me/favorites')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.not.arrayContaining([otherFavorite]));

      // and this
      const response2 = await request.get('/api/me/favorites')
        .set('Authorization', user2.token);

      expect(response2.status).toBe(200);
      expect(response2.body).toEqual([otherFavorite]);

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
});