const {models: {User} } = require('data')
const { NotFoundError, NotAllowedError } = require('errors')
const { validate } = require('utils')

module.exports = (id) => {
    validate.string(id, 'id')

    return (async() => {
        const user = await User.findById(id)
        if(!user) throw new NotAllowedError(`user with id: ${id} not found`)

        const users = await User.find().lean()
        if(!users) throw new NotFoundError('there are not users')

        users.forEach(user => {
            user.id = user._id.toString()
            delete user._id
            delete user.__v
            delete user.password
            delete user.deactivated
            delete user.createdAt
        })


        return users

    })()
}