import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import cors from "cors";
dotenv.config();

const app = express();

const { Pool } = pg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(cors());

app.post('/categories', async (req, res) => {
  const { name } = req.body;

  //fazer validação joi para não ser vazio
  try {
    let isRepeated = (await connection.query('SELECT id FROM categories WHERE name = $1;', [name])).rowCount;

    if (isRepeated === 0) {

      await connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
      res.sendStatus(201);
    } else {
      res.sendStatus(409);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

});

app.get('/categories', async (req, res) => {

  try {
    const categories = (await connection.query('SELECT * FROM categories;')).rows;

    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listen on port ${process.env.PORT}`);
});