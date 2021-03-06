import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './acount-mongo-repository'
import { AccountModel } from '../../../../domain/models/account'
import { Collection } from 'mongodb'

describe('Account - Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async function () {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async function () {
    await MongoHelper.disconnect()
  })

  beforeEach(async function () {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    const sut = new AccountMongoRepository()
    return sut
  }

  it('Should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.addUserAccount({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('James Delos')
    expect(account.email).toBe('james@delos.com')
    expect(account.password).toBe('strongpassword')
  })

  it('Should return an account loadByEmail', async () => {
    const sut = makeSut()
    await sut.addUserAccount({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword'
    })
    const accountReturn = await sut.loadAccountUsingEmail('james@delos.com')
    expect(accountReturn).toBeTruthy()
    expect(accountReturn.id).toBeTruthy()
    expect(accountReturn.name).toBe('James Delos')
    expect(accountReturn.email).toBe('james@delos.com')
    expect(accountReturn.password).toBe('strongpassword')
  })

  it('Should return an account loadByEmail', async () => {
    const sut = makeSut()
    await sut.addUserAccount({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword'
    })
    const accountReturn = await sut.loadAccountUsingEmail('james@evergreen.com')
    expect(accountReturn).toBeFalsy()
  })

  it('Should update account\'s access token on successful onUpdateAccessToken', async () => {
    const sut = makeSut()
    const res: AccountModel = await sut.addUserAccount({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword'
    })
    await sut.updateAccessToken(res.id, 'any_token')
    const accountReturn = await sut.loadAccountUsingEmail('james@delos.com') as any
    expect(accountReturn.accessToken).toBeTruthy()
  })

  describe('Load account by token without role', () => {
    it('Should return an account on loadByToken success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'James Delos',
        email: 'james@delos.com',
        password: 'strongpassword',
        accessToken: 'token'
      })
      const accountReturn = await sut.loadByToken('token')
      expect(accountReturn).toBeTruthy()
      expect(accountReturn.id).toBeTruthy()
      expect(accountReturn.name).toBe('James Delos')
      expect(accountReturn.email).toBe('james@delos.com')
      expect(accountReturn.password).toBe('strongpassword')
    })
  })

  it('Should return an account on loadByToken success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword',
      role: 'admin',
      accessToken: 'second_token'
    })
    const accountReturn = await sut.loadByToken('second_token', 'admin')
    expect(accountReturn).toBeTruthy()
    expect(accountReturn.id).toBeTruthy()
    expect(accountReturn.name).toBe('James Delos')
    expect(accountReturn.email).toBe('james@delos.com')
    expect(accountReturn.password).toBe('strongpassword')
  })

  it('Should return null on loadByToken fail', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'James Delos',
      email: 'james@delos.com',
      password: 'strongpassword',
      role: 'admin',
      accessToken: 'second_token'
    })
    const accountReturn = await sut.loadByToken('any', 'admin')
    expect(accountReturn).toBeNull()
  })
})
