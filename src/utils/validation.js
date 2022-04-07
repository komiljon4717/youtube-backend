const Joi = require('joi')

const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).alphanum().required(),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/),
    //repeatPassword: Joi.ref('password'),
    // birthYear: Joi.number().integer().min(1900).max(2020),
    //gender: Joi.string().valid('male', 'female').required(),
    //contact: Joi.string().pattern(new RegExp('^998(9[012345789]|3[3]|7[1]|8[8])[0-9]{7}$')),
    //email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'password')
    //.with('password', 'repeatPassword')
    //.xor('contact', 'email')

process.JOI = {
    userSchema
}
