import connection from "../db/db.js";
import { gameSchema } from "../schemas/games.schema.js";

const createGame = async (req, res) => {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const validation = gameSchema.validate({
    name,
    image,
    stockTotal,
    categoryId,
    pricePerDay
  }, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map(error => error.message);
    return res.status(400).send(errors);
  }

  try {
    const categoryExists = (await connection.query(`SELECT id FROM categories WHERE id = $1;`,
      [categoryId])).rowCount;

    if (!categoryExists) {
      return res.sendStatus(400);
    }

    const isRepeated = (await connection.query(`SELECT id FROM games WHERE name = $1`,
      [name])).rowCount;

    if (!isRepeated) {
      await connection.query(`
      INSERT INTO games 
        (name, image, "stockTotal", "categoryId", "pricePerDay") 
      VALUES ($1,$2,$3,$4,$5);`,
        [name, image, stockTotal, categoryId, pricePerDay]);
      return res.sendStatus(201);
    }

    res.sendStatus(409);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const listGames = async (req, res) => {
  const { name } = req.query;
  try {
    if (name) {
      const games = (await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE $1;', [`${name}%`])).rows;

      return res.send(games);
    }
    const games = (await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;')).rows;

    res.send(games);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export { createGame, listGames };