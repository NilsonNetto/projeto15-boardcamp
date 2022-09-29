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

app.post('/games', async (req, res) => {
  const game = req.body;

  try {
    const isValid = (await connection.query('SELECT id FROM games WHERE name = $1', [game.name])).rowCount;

    //fazer validação joi para não ser vazio
    if (isValid === 0) {
      await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5);', [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]);
      return res.sendStatus(201);
    }

    res.sendStatus(409);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get('/games', async (req, res) => {
  try {
    const games = (await connection.query('SELECT * FROM games;')).rows;

    res.send(games);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/customers', async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;

  //fazer validação joi
  try {

    const isValid = (await connection.query('SELECT id FROM customers WHERE cpf = $1;', [cpf])).rowCount;

    if (isValid === 0) {

      await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);', [name, phone, cpf, birthday]);
      return res.sendStatus(201);
    }
    res.sendStatus(409);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.put('/customers:id', async (req, res) => {
  const userId = req.params.id;
  const { name, phone, cpf, birthday } = req.body;

  //fazer validação joi
  try {

    const isValid = (await connection.query('SELECT id FROM customers WHERE id = $1;', [userId])).rowCount;

    if (isValid === 0) {

      await connection.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;', [name, phone, cpf, birthday, userId]);
      return res.sendStatus(201);
    }
    res.sendStatus(409);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listen on port ${process.env.PORT}`);
});