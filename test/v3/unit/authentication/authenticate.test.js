import test from 'ava'
import sinon from 'sinon'
import mockery from 'mockery'

let authenticate

// mocking the get-csv library, to return some users
// must require authenticate _after_ this, so that the mock of get-csv is used
test.beforeEach(() => {
  mockery.enable()

  process.env.SHEETS_URL = 'abcdef'
  mockery.registerMock('get-csv', () => {
    return Promise.resolve([
      {
        username: 'user',
        password: '123',
        instance_slug: 'abc',
        read: '1,2,3',
        write: '4,5,6'
      },
      {
        username: 'dev',
        password: '123',
        instance_slug: 'all',
        read: '1,2,3',
        write: '4,5,6'
      }
    ])
  })

  const path = '../../../../src/v3/routes/authentication'
  mockery.registerAllowable(path)
  authenticate = require(path).authenticate
})

test.afterEach(() => mockery.disable())

test('mock ', t => {
  process.env.SHEETS_URL = 'abcdef'
  mockery.registerMock('get-csv', () => {
    return Promise.resolve([
      {
        username: 'user',
        password: '123',
        instance_slug: 'abc'
      }
    ])
  })

  const fn = require('get-csv')
  const actual = fn()

  t.true(actual instanceof Promise)
})

test('user can login with right credentials', async t => {
  const req = {
    body: {user: {username: 'user', password: '123'}},
    country: 'abc'
  }
  const res = {
    send: sinon.spy()
  }

  await authenticate(req, res)

  t.true(res.send.calledOnce)
})

test('user cannot login with wrong credentials', async t => {
  const req = {
    body: {user: {username: 'user', password: '456'}},
    country: 'abc'
  }
  const spy = sinon.spy()

  const res = {
    status: () => {
      return {
        send: spy
      }
    }
  }

  await authenticate(req, res)

  t.true(spy.calledOnce)
})

test('unauth user results in status called with 401', async t => {
  const req = {
    body: {user: {username: 'user', password: '456'}},
    country: 'abc'
  }

  const res = {
    status: sinon.stub().returns({send: () => {}})
  }

  await authenticate(req, res)

  t.is(res.status.getCall(0).args[0], 401)
})

test('unauth user results in `Unknown user` message', async t => {
  const req = {
    body: {user: {username: 'user', password: '456'}},
    country: 'abc'
  }

  const spy = sinon.spy()
  const res = {
    status: () => {
      return {
        send: spy
      }
    }
  }

  await authenticate(req, res)

  t.deepEqual(spy.getCall(0).args[0], {error: 'Unknown user'})
})

test('dev user can login to any instance', async t => {
  const req = {
    body: {user: {username: 'dev', password: '123'}},
    country: 'abc'
  }

  const res = {
    send: sinon.spy()
  }

  await authenticate(req, res)
  t.true(res.send.calledOnce)
})