import joi from "joi";

const customerSchema = joi.object({
  name: joi.string().min(3).trim().required(),
  phone: joi.string().pattern(/\(?[1-9]{2}\)? ?[9]{0,1}[0-9]{4}\-?[0-9]{4}/, 'telefone numbers').min(10).max(11).required(),
  cpf: joi.string().pattern(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/, 'cpf numbers').length(11).required(),
  birthday: joi.date().less('now').required()
});

export { customerSchema };