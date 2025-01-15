require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Conexiunea la baza de date
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
const port = 3000;

// Middleware-uri
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Ruta pentru dashboard
app.get('/profile', (req, res) => {
  console.log('Profile endpoint accessed');
  res.json({ message: 'Welcome to the profile' });
});

// Adaugă ruta pentru autentificare
app.post('/login', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token missing' });
  }

  try {
    // Verifică și decodează token-ul JWT primit de la frontend
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Verifică dacă ID-ul clientului este corect
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Verifică utilizatorul în baza de date
    db.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (result.rows.length === 0) {
        // Dacă utilizatorul nu există, creează-l
        console.log('User not found, creating new user.');
        db.query(
          'INSERT INTO users (name, given_name, family_name, email, picture) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [payload.name, payload.given_name, payload.family_name, email, payload.picture],
          (err, result) => {
            if (err) {
              console.error('Error inserting user:', err);
              return res.status(500).json({ success: false, message: 'Error inserting user' });
            }
            console.log('New user created:', result.rows[0]);
            res.json({ success: true, message: 'User created and authenticated' });
          },
        );
      } else {
        // Dacă utilizatorul există deja
        console.log('User found:', result.rows[0]);
        res.json({ success: true, message: 'User authenticated' });
      }
    });

  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
});

// Pornire server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.post('/games', async (req, res) => {
  const { user_id, difficulty, duration, win } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO games (user_id, difficulty, duration, win) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, difficulty, duration, win]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create game session' });
  }
});

app.get('/games/top', async (req, res) => {
  const { difficulty } = req.query;

  try {
    const result = await db.query(
      `SELECT u.name, g.duration
       FROM games g
       JOIN users u ON g.user_id = u.id
       WHERE g.difficulty = $1 AND g.win = true
       ORDER BY g.duration ASC
       LIMIT 10`,
      [difficulty]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch top users' });
  }
});

app.get('/games/wins-count', async (req, res) => {
  const { user_id, difficulty } = req.query;

  try {
    // Interogare pentru a obține numărul total de jocuri și câștigurile
    const result = await db.query(
      'SELECT COUNT(*) AS total_games, SUM(CASE WHEN win = TRUE THEN 1 ELSE 0 END) AS won_games FROM games WHERE user_id = $1 AND difficulty = $2',
      [user_id, difficulty]
    );

    // Verificăm dacă există un rezultat
    const row = result.rows[0];
    if (row) {
      const totalWins = parseInt(row.won_games || '0', 10); // Convertim `won_games` în număr și tratăm cazul null
      res.status(200).json({ totalWins });
    } else {
      res.status(404).json({ error: 'No data found for the provided user and difficulty' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch game wins count' });
  }
});


app.get('/games/count', async (req, res) => {
  const { user_id, difficulty } = req.query;

  try {
    // Interogare pentru a număra jocurile totale
    const result = await db.query(
      'SELECT COUNT(*) AS total_games FROM games WHERE user_id = $1 AND difficulty = $2',
      [user_id, difficulty]
    );

    // Verificăm dacă există un rezultat
    const row = result.rows[0];
    if (row) {
      const totalGames = parseInt(row.total_games, 10); // Convertim numărul în format numeric
      res.status(200).json({ totalGames });
    } else {
      res.status(404).json({ error: 'No data found for the provided user and difficulty' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch total game count' });
  }
});


app.get('/api/getUserIdByEmail', async (req, res) => {
  const email = req.query.email;  // Obținem email-ul din query string
  // Căutăm utilizatorul în baza de date
  const user = await db.query('SELECT id FROM users WHERE email = $1', [email]);

  if (user.rows.length > 0) {
      res.json({ id: user.rows[0].id });
  } else {
      res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
  }
});