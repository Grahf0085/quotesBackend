/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';
import request from 'superagent';
import { formattedQuotes } from '../lib/utils.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);


// heartbeat route
app.get('/', (req, res) => {
  res.send('Famous Quotes API');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:

app.post('/api/quotes', async (req, res) => {
  const quote = req.body;
  try {
    const data = await client.query(`
    INSERT INTO quotes (quote, author, tags, favorited, user_id)
    VALUES ($1, $2, $3, $4, $5)
    `,
      [quote.quote, quote.author, quote.tags, quote.favorited, req.userId]);
    res.json(data.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quotes', async (req, res) => {
  // use SQL query to get data...
  try {
    const response = await request.get('https://favqs.com/api/quotes')
      .set('Authorization', `Token token=${process.env.QUOTE_KEY}`);

    const data = formattedQuotes(response.body);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const favorite = req.body;

    const data = await client.query(`
      INSERT INTO quotes (quote, author, tags, favorited, user_id)
      VALUES      ($1, $2, $3, $4, $5)
      RETURNING   id, quote, author, tags, favorited, user_id as "UserId";
    `, [favorite.quote, favorite.author, favorite.tags, favorite.favorited, req.userId]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


export default app;