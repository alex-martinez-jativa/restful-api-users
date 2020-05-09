const { models: {User} } = require('data')
const { NotAllowedError, NotFoundError } = require('errors')
const { validate } = require('utils')
const bycrpt = require('bcrypt')

module.exports = (id, password) => {
    validate.string(id, 'id')
    validate.string(password, 'password')

    return (async() => {
        const user = await User.findById(id)
        if(!user) throw new NotFoundError(`user with id: ${id} does not exist`)
        const pass = await bycrpt.compare(password, user.password)
        if(!pass) throw new NotAllowedError('wrong credentials')

        await User.findByIdAndRemove({_id: id})
        
    })()
} 