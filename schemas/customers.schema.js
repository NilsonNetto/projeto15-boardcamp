import joi from "joi";

const customerSchema = joi.object({
  name: joi.string().min(3).trim().required(),
  phone: joi.string().min(10).max(11).required(),
  cpf: joi.string().pattern(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/, 'numbers').length(11).required(),
  birthday: joi.date().less('now').required()
});

export { customerSchema };