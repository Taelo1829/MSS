const express = require('express');
const session = require('express-session');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 }, 
  })
);

// 🔌 Save credentials into session
app.post('/connect', async (req, res) => {
  const { server, user, password, database, port } = req.body;

  const config = {
    user,
    password,
    server,
    database,
    port: port || 1433,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };

  try {
    await sql.connect(config);
    req.session.dbConfig = config; // Save config to session
    res.send({ success: true, message: 'Connected and saved session.' });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

app.post('/query', async (req, res) => {
  const { query } = req.body;

  const config = req.session.dbConfig;
  if (!config) {
    return res.status(400).send({ success: false, message: 'No session config found. Please connect first.' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send({ success: true, message: 'Logged out and session cleared.' });
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend with sessions running on http://localhost:${PORT}`));
