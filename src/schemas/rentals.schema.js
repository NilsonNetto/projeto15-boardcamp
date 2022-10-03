import joi from "joi";

const rentalSchema = joi.object({
  customerId: joi.number().integer().min(1).required(),
  gameId: joi.number().integer().min(1).required(),
  daysRented: joi.number().integer().min(1).required(),
});

export { rentalSchema };