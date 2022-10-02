import { customerSchema } from "../schemas/customers.schema.js";

export default async function customerValidation(req, res, next) {
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
  res.locals.body = { name, phone, cpf, birthday };
  next();
};