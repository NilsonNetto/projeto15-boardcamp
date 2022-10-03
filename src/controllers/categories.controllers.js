import connection from "../db/db.js";
import { categorySchema } from "../schemas/categories.schema.js";

const createCategory = async (req, res) => {
  const { name } = req.body;

  const validation = categorySchema.validate({ name }, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map(error => error.message);
    return res.status(400).send(errors);
  }

  try {
    const isRepeated = (await connection.query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1);', [name])).rowCount;

    if (!isRepeated) {

      await connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
      return res.sendStatus(201);
    }

    res.sendStatus(409);
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