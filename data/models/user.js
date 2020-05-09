const {model, Schema } = require('mongoose')

const UserSchema = new Schema({
    name: {type: String, required: true, trim: true},
    surname: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    createdAt: {type: Date, required: true, default: Date.now()},
    authenticatedAt: {type: Date},
    deactivated: {type: Boolean, default: false}
})

module.exports = model('User', UserSchema)