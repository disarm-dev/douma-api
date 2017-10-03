import test from 'ava'

import {_authenticate_user} from '../../../../src/v3/routes/authentication'

test('can find a user in users array', t => {
  const requesting_user = {
    username: 'user',
    password: '123',
  }
  const instance_slug = 'abc'

  const users = [
    {
      username: 'user',
      password: '123',
      instance_slug: 'abc'
    }
  ]

  const actual = _authenticate_user({users, requesting_user, instance_slug})

  t.truthy(actual)
})

test('removes password from returned user object', t => {
  const requesting_user = {
    username: 'user',
    password: '123',
  }
  const instance_slug = 'abc'

  const users = [
    {
      username: 'user',
      password: '123',
      instance_slug: 'abc'
    }
  ]

  const auth_result = _authenticate_user({users, requesting_user, instance_slug})
  const password = auth_result.password

  t.is(password, undefined)
})

test('returns false if user not exist', t => {
  const requesting_user = {
    username: 'not_a_user',
    password: '123',
  }
  const instance_slug = 'abc'

  const users = [
    {
      username: 'user',
      password: '123',
      instance_slug: 'abc'
    }
  ]

  const auth_result = _authenticate_user({users, requesting_user, instance_slug})

  t.false(auth_result)

})

test('returns false with invalid requesting user (no username)', t => {
  const requesting_user = {
    password: '123'
  }
  const instance_slug = 'abc'

  const users = [
    {
      username: 'user',
      password: '123',
      instance_slug: 'all'
    }
  ]

  const auth_result = _authenticate_user({users, requesting_user, instance_slug})

  t.false(auth_result)

})

test('returns false with invalid requesting user (no password)', t => {
  const requesting_user = {
    username: 'user'
  }
  const instance_slug = 'abc'

  const users = [
    {
      username: 'user',
      password: '123',
      instance_slug: 'abc'
    }
  ]

  const auth_result = _authenticate_user({users, requesting_user, instance_slug})

  t.false(auth_result)
})

test('returns false if cannot find user with password', t => {
  const requesting_user = {
    username: 'user',
    password: '123'
  }
  const instance_slug = 'abc'

  const users = [
    {
      username: 'user',
      password: '456',
      instance_slug: 'abc'
    }
  ]

  const auth_result = _authenticate_user({users, requesting_user, instance_slug})

  t.false(auth_result)
})

test('handles a dev user with access to all instances', t => {
  const requesting_user = {
    username: 'user',
    password: '123',
  }
  const instance_slug = 'abc'

  const users = [
    {
      username: 'user',
      password: '123',
      instance_slug: 'all'
    }
  ]

  const auth_result = _authenticate_user({users, requesting_user, instance_slug})

  t.truthy(auth_result)
})


