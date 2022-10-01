import connection from "../db/db.js";
import dayjs from "dayjs";
import { rentalSchema } from "../schemas/rentals.schema.js";

const createRental = async (req, res) => {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = dayjs().format('YYYY-MM-DD');

  const validation = rentalSchema.validate({
    customerId,
    gameId,
    daysRented
  }, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map(error => error.message);
    return res.status(400).send(errors);
  }

  try {

    const gameExists = (await connection.query('SELECT * FROM games WHERE id = $1;', [gameId])).rows[0];

    const userExists = (await connection.query(`SELECT id FROM customers WHERE id = $1;`, [customerId])).rowCount;

    if (!userExists || !gameExists) {
      return res.sendStatus(400);
    }

    const originalPrice = gameExists.pricePerDay * daysRented;

    const gameRentals = (await connection.query(`
    SELECT *
    FROM rentals
    WHERE "gameId" = $1 AND "returnDate" IS NULL`,
      [gameId])).rowCount;

    if (gameRentals >= gameExists.stockTotal) {
      return res.sendStatus(400);
    }

    await connection.query(`
    INSERT INTO rentals 
      ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
    VALUES ($1,$2,$3,$4,NULL,$5,NULL);`,
      [customerId, gameId, rentDate, daysRented, originalPrice]);

    res.sendStatus(201);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const listRentals = async (req, res) => {
  const { customerId, gameId } = req.query;

  try {

    if (customerId && !isNaN(customerId)) {
      const rentals = (await connection.query(`SELECT 
      rentals.*,
      jsonb_build_object ('id', customers.id, 'name', customers.name) AS customer,
      jsonb_build_object ('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game"
    FROM rentals 
    JOIN customers 
      ON rentals."customerId" = customers.id 
    JOIN games 
      ON rentals."gameId" = games.id
    JOIN categories
      ON games."categoryId" = categories.id
    WHERE rentals."customerId" = $1;`, [customerId])).rows;

      return res.send(rentals);
    }

    if (gameId && !isNaN(gameId)) {
      const rentals = (await connection.query(`SELECT 
      rentals.*,
      jsonb_build_object ('id', customers.id, 'name', customers.name) AS customer,
      jsonb_build_object ('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game"
    FROM rentals 
    JOIN customers 
      ON rentals."customerId" = customers.id 
    JOIN games 
      ON rentals."gameId" = games.id
    JOIN categories
      ON games."categoryId" = categories.id
    WHERE rentals."gameId" = $1;`, [gameId])).rows;

      return res.send(rentals);
    }

    const rentals = (await connection.query(`SELECT 
      rentals.*,
      jsonb_build_object ('id', customers.id, 'name', customers.name) AS customer,
      jsonb_build_object ('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game"
    FROM rentals 
    JOIN customers 
      ON rentals."customerId" = customers.id 
    JOIN games 
      ON rentals."gameId" = games.id
    JOIN categories
      ON games."categoryId" = categories.id;`)).rows;

    res.send(rentals);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

};

const endRental = async (req, res) => {
  const rentalId = req.params.id;
  const returnDate = dayjs().format('YYYY-MM-DD');
  const dayMiliseconds = 1000 * 60 * 60 * 24;
  let delayFee = 0;

  if (isNaN(rentalId)) {
    return res.sendStatus(404);
  }

  try {
    const rental = (await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [rentalId])).rows[0];

    if (!rental) {
      return res.sendStatus(404);
    }

    if (rental.returnDate) {
      return res.sendStatus(400);
    }

    const daysPassed = (Math.floor((Date.now() - rental.rentDate.getTime()) / dayMiliseconds));

    if (daysPassed > rental.daysRented) {
      delayFee = daysPassed * rental.originalPrice;
    }

    await connection.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`, [returnDate, delayFee, rentalId]);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

};

const deleteRental = async (req, res) => {
  const rentalId = req.params.id;

  if (isNaN(rentalId)) {
    return res.sendStatus(404);
  }

  try {

    const rental = (await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [rentalId])).rows[0];

    if (!rental) {
      return res.sendStatus(404);
    }

    if (rental.returnDate) {
      await connection.query(`DELETE FROM rentals WHERE id = $1;`, [rentalId]);
      return res.sendStatus(200);
    }

    res.sendStatus(400);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export { createRental, listRentals, endRental, deleteRental };