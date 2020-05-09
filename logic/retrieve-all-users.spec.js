require('dotenv').config()
const { mongoose, models: { User } } = require('data')
const { NotFoundError, ContentError } = require('errors')
const { random } = Math
const { expect } = require('chai')
const bcrypt = require('bcrypt')
const { env: {TEST_MONGODB_URL} } = process
const { retrieveAllUsers } = require('.')

describe('retrieve all users', () => {
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
        it('should succeed on correct id', async() => {
            const retrieve = await retrieveAllUsers(id)
            expect(retrieve).to.exist
        })
        it('should fail on unexist user with the id', () => {
            let id = '5eb51ba6741190244e49becc'
            retrieveAllUsers(id)
            .catch(({message}) => {
                debugger
                expect(message).to.be.equal(`user with id: ${id} not found`)
            }) 
        })
        describe('unhappy paths', () => {
            it('should fail on non-string id', () => {
                let id = 1234
                expect(() => retrieveAllUsers(id)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = true
                expect(() => retrieveAllUsers(id)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = undefined
                expect(() => retrieveAllUsers(id)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = ''
                expect(() => retrieveAllUsers(id)).to.throw(ContentError, `${id} is empty`)
            })
        })
    })
    after(async() => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})