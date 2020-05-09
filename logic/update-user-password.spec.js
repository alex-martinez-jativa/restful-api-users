require('dotenv').config()
const { mongoose, models: { User } } = require('data')
const {env: {TEST_MONGODB_URL} } = process
const { random } = Math
const { ContentError } = require('errors')
const { expect } = require('chai')
const bcrypt = require('bcrypt')
const { updateUserPassword } = require('.')

describe.only('update user password', () => {
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

        it('should update on correct data', async() => {
            let newPassword = '111'
            await updateUserPassword(id, password, newPassword)
            const user = await User.findById(id)
            
            const pass = await bcrypt.compare(newPassword, user.password)
            expect(pass).to.be.true
        })

        describe('unhappy paths', () => {
            it('should fail on non-string id', () => {
                let id = 1234
                let newPassword = '111'
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = false
                let newPassword = '111'
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = undefined
                let newPassword = '111'
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `id ${id} is not a string`)
            })
            it('should fail on non-string id', () => {
                let id = ''
                let newPassword = '111'
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(ContentError, `${id} is empty`)
            })

            it('should fail on non-string password', () => {
                let password = 1234
                let newPassword = '111'
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `password ${password} is not a string`)
            })
            it('should fail on non-string id', () => {
                let password = false
                let newPassword = '111'
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `password ${password} is not a string`)
            })
            it('should fail on non-string id', () => {
                let password = undefined
                let newPassword = '111'
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `password ${password} is not a string`)
            })
            it('should fail on non-string id', () => {
                let password = ''
                let newPassword = '111'
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(ContentError, `${password} is empty`)
            })
            it('should fail on non-string password', () => {
                let newPassword = 4321
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `new password ${newPassword} is not a string`)
            })
            it('should fail on non-string id', () => {
                let newPassword = true
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `new password ${newPassword} is not a string`)
            })
            it('should fail on non-string id', () => {
                let newPassword = undefined
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(TypeError, `new password ${newPassword} is not a string`)
            })
            it('should fail on non-string id', () => {
                let newPassword = ''
                expect(() => updateUserPassword(id, password, newPassword)).to.throw(ContentError, `${newPassword} is empty`)
            })
            
        })
    })
    after(async() => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})