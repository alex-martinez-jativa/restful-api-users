const { models: {User} } = require('data')
const {validate} = require('utils')
const { NotAllowedError } = require('errors')
const bcrypt = require('bcrypt')

module.exports = (name, surname, username, email, password) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(username, 'user name')
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return (async() => {
        const user = await User.findOne({email})
        if(user) throw new NotAllowedError(`user with email ${email} already exist`)
        const _username = await User.findOne({username})
        if(_username) throw new NotAllowedError(`user with username ${username} already exist`)

        const pass = await bcrypt.hash(password, 10)
        
        await User.create({name, surname, username, email, password: pass})
    })()
}