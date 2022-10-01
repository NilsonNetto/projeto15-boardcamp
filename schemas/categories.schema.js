import joi from "joi";

const categorySchema = joi.object({
  name: joi.string().min(3).trim().required()
});

export { categorySchema };