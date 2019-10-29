const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object().keys({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email({
            minDomainSegments: 2
        }).required(),
        password: Joi.string().min(6).required(),
        password2: Joi.ref('password')
    });
    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object().keys({
        email: Joi.string().email({
            minDomainSegments: 2
        }).required(),
        password: Joi.string().alphanum().min(6).required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;