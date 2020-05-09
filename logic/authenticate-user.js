const { models: { User } } = require('data')
const { validate } = require('utils')
const { NotAllowedError } = require('errors')
const bcrypt = require('bcrypt')

module.exports = (email, password) => {
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return (async() => {
        const user = await User.findOne({email})
        if(!user) throw new NotAllowedError('wrong credentials')

        const pass = await bcrypt.compare(password, user.password)
        if(!pass) throw new NotAllowedError('wrong credentials')

        user.authenticatedAt = new Date

        return user.id
    })()
}