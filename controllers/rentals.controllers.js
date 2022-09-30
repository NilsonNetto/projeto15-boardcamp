import connection from "../db/db.js";

const createRental = async (req, res) => {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = dayToday();

  try {

    const { pricePerDay } = (await connection.query('SELECT "pricePerDay" FROM games WHERE id = $1;', [gameId])).rows[0];
    const originalPrice = pricePerDay * daysRented;

    await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1,$2,$3,$4,NULL,$5,NULL);', [customerId, gameId, rentDate, daysRented, originalPrice]);

    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

function dayToday() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export { createRental };