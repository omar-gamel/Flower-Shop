const Joi = require('joi');

exports.validateUser = (user) => {
    const schema = {
        // ...
    }
    return Joi.validate(user, schema);
};

exports.validateFlower = (flower) => {
    const schema = {
        flowerName: Joi.string().not().empty().min(5).max(50).required().lowercase(),
        price: Joi.number().not().empty().min(2).max(3),
        description: Joi.string().not().empty().min(10).max(255).not().empty(),
        sponsored: Joi.boolean(),
        creationDate: Joi.date()
    }
    return Joi.validate(flower, schema);
};