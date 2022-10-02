import connection from "../db/db.js";
import { customerSchema } from "../schemas/customers.schema.js";

const createCustomer = async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;

  const validation = customerSchema.validate({
    name,
    phone,
    cpf,
    birthday,
  }, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map(error => error.message);
    return res.status(400).send(errors);
  }

  try {

    const isRepeated = (await connection.query('SELECT id FROM customers WHERE cpf = $1;', [cpf])).rowCount;

    if (!isRepeated) {
      await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);', [name, phone, cpf, birthday]);

      return res.sendStatus(201);
    }
    res.sendStatus(409);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const updateCustomer = async (req, res) => {
  const userId = req.params.id;
  const { name, phone, cpf, birthday } = req.body;

  const validation = customerSchema.validate({
    name,
    phone,
    cpf,
    birthday,
  }, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map(error => error.message);
    return res.status(400).send(errors);
  }

  try {

    const customer = (await connection.query('SELECT * FROM customers WHERE id = $1;', [userId])).rows[0];

    if (customer) {

      const isRepeated = await connection.query('SELECT cpf FROM customers WHERE cpf = $1;', [cpf]);

      if (!isRepeated.rowCount || customer.cpf === isRepeated.rows[0].cpf) {
        await connection.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;', [name, phone, cpf, birthday, userId]);
        return res.sendStatus(200);
      }

      return res.sendStatus(409);
    }
    res.sendStatus(404);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const listCustomers = async (req, res) => {
  const { cpf } = req.query;

  try {
    if (cpf) {
      const customers = (await connection.query('SELECT * FROM customers WHERE cpf LIKE $1;', [`${cpf}%`])).rows;
      return res.send(customers);
    }

    const customers = (await connection.query('SELECT * FROM customers;')).rows;
    res.send(customers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const listCustomerById = async (req, res) => {
  const userId = req.params.id;

  try {
    const customer = (await connection.query('SELECT * FROM customers WHERE id = $1;', [userId])).rows[0];

    if (customer) {
      return res.send(customer);
    }
    res.sendStatus(404);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export {
  createCustomer, updateCustomer, listCustomers, listCustomerById
};