const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const House = require("../models/houserequest");

const houseValidationMiddleware = (req, res, next) => {
  const schema = Joi.object({
    location: Joi.string().required(),
    type: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    availability: Joi.string()
      .valid("available", "unavailable", "rented")
      .required(),
    photos: Joi.array().items(Joi.string().required()).required(),
    rating: Joi.number().min(1).max(5).required(),
  });

  const validation = schema.validate(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error.details[0].message });
  }

  next();
};

module.exports = houseValidationMiddleware;
