const { AuthorizationError, InternalServerError } = require('../utils/error.js')

const GET = (req, res, next) => {
    try {
        let users = req.readFile('users') || []

        users = users.map(user => {
            delete user.password
            return user
        })

        return res.status(200).json(users)

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

module.exports = {
    GET
}