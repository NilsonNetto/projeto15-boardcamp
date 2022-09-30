import connection from "../db/db.js";

const createGame = async (req, res) => {
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
};

const listGames = async (req, res) => {
  try {
    const games = (await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;')).rows;

    res.send(games);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export { createGame, listGames };