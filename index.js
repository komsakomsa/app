import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
}
});

db.connect(err => {
  if (err) {
    console.error('Greska pri povezivanju na bazu:', err);
  } else {
    console.log('Uspesno povezano na bazu');
  }
});

app.post('/dodaj', (req, res) => {
  const { ime, prezime } = req.body;
  db.query('INSERT INTO korisnici (ime, prezime) VALUES (?, ?)', [ime, prezime], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Uspešno dodato!');
  });
});

app.get('/svi', (req, res) => {
  db.query('SELECT * FROM korisnici', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
