import connection from "../db/db.js";

const createCategory = async (req, res) => {
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

};

const listCategories = async (req, res) => {

  try {
    const categories = (await connection.query('SELECT * FROM categories;')).rows;

    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export { createCategory, listCategories };