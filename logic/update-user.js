const { models: {User} } = require('data')
const { NotFoundError } = require('errors')
const { validate } = require('utils')

module.exports = (id, data) => {
    validate.string(id, 'id')
    validate.type(data, 'data', Object)

    const newFields = {}

    for(keys in data) {
        newFields[keys] = data[keys]
    }
    delete newFields.password

    return (async() => {
       
        const user = await User.findOneAndUpdate(id, {$set: newFields})
        if(!user) throw new NotFoundError(`User with id: ${id} does not exist`)
        await user.save()
    })()
}