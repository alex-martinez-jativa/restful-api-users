const { models: {User} } = require('data')
const { NotAllowedError, NotFoundError } = require('errors')
const { validate } = require('utils')
const bcrypt = require('bcrypt')

module.exports = (id, password, newPassword) => {
    validate.string(id, 'id')
    validate.string(password, 'password')
    validate.string(newPassword, 'new password')

    return (async() => {
        const user = await User.findById(id)
        if(!user) throw new NotFoundError(`user with id: ${id} does not exist`)
        const pass = await bcrypt.compare(password, user.password)
        if(!pass) throw new NotAllowedError(`wrong credentials`)

        debugger
        const newPass = await bcrypt.hash(newPassword, 10)
        const _user = await User.findOneAndUpdate(id, {password: newPass})
        await _user.save()

    })()
}