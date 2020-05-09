const { models: { User } } = require('data')
const { NotFoundError, NotAllowedError } = require('errors')
const { validate } = require('utils')

module.exports = (id) => {
    validate.string(id, 'id')

    return (async() => {
        const user = await User.findById(id).lean()
        if(!user) throw new NotFoundError(`user with id: ${id} not found`)
        if(user.deactivated) throw new NotAllowedError(`user with id: ${id} is deactivated`)

        user.id = user._id.toString()
        delete user._id
        delete user.__v
        
        const { name, surname, username, email} = user

        return {id, name, surname, username, email}
    })()
}