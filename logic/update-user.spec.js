require('dotenv').config()
const { mongoose, models: { User } } = require('data')
const {env: {TEST_MONGODB_URL} } = process
const { random } = Math
const { ContentError } = require('errors')
const { expect } = require('chai')
const bcrypt = require('bcrypt')
const { updateUser } = require('.')

describe('update user', () => {
    before(() => 
        mongoose.connect(TEST_MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => User.deleteMany())
    )
    let name, surname, username, email, password, id

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        username = `username-${random()}`
        email = `mail-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exist', () => {
        beforeEach( async() => {
            const pass = await bcrypt.hash(password, 10)
            await User.create({name, surname, username, email, password: pass})
            const userId = await User.findOne({username})
            id = userId._id.toString()
        })
        it('should succeed on correct data', async() => {
            let data = {
                name: 'test-name',
                username: 'test-username',
                email: 'test@mail.com'
            }
            await updateUser(id, data)
            const user = await User.findById(id)
            expect(user.name).to.be.equal(data.name)
            expect(user.username).to.be.equal(data.username)
            expect(user.email).to.be.equal(data.email) 
        })
        describe('unhappy paths', () => {
            it('should fail on non string id', () => {
                let id = 1234
                expect(() => updateUser(id, password)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non string id', () => {
                let id = true
                expect(() => updateUser(id, password)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non string id', () => {
                let id = undefined
                expect(() => updateUser(id, password)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non string id', () => {
                let id = ''
                expect(() => updateUser(id, password)).to.throw(ContentError, `${id} is empty`)
            })
            it('should fail on non object data', () => {
                let data = 1234
                expect(() => updateUser(id, data)).to.throw(TypeError, `${data} is not an Object`)
            })
            it('should fail on non Object data', () => {
                let data = false
                expect(() => updateUser(id, data)).to.throw(TypeError, `${data} is not an Object`)
            })
            it('should fail on non Object data', () => {
                let data
                expect(() => updateUser(id, data)).to.throw(TypeError, `${data} is not an Object`)
            })
            
        })
    })
    after(async() => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})