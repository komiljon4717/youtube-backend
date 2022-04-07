const { ValidationError } = require('../utils/error.js')
const url = require('url')

module.exports = (req, res, next) => {
    try {
        const { pathname } = url.parse(req.url)
        
        switch (pathname) {
           case '/register': {
                const data = process.JOI.userSchema.validate(req.body)
                if (data.error) {
                    return next(new ValidationError(400, data.error))
                } 
                return next()
            }
        }
        
        return next()
        
    } catch (error) {
        return next(error)
    }
}