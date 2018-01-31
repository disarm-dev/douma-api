import test from 'ava'

import {formatUserPermissions} from '../../../../src/v3/routes/authentication'

test('remove `read` and `write` properties', t => {
  const users = {read: '1,2,4', write: '1,2,3'}

  const actual = formatUserPermissions(users)

  t.is(actual.write, undefined)
  t.is(actual.read, undefined)
})

test('allowed_apps exists', t => {
  const users = {read: '1,2,4', write: '1,2,3'}

  const actual = formatUserPermissions(users)

  t.deepEqual(actual.allowed_apps.read, ['1','2','4'])
})

test('user object must have `read` and `write` string properties or returns empty object', t => {
  const user = {}

  const actual = formatUserPermissions(user)

  t.deepEqual(actual, {})
})

test('take a single user object', t => {
  const user = {read: '1,23', write: '123,4,5'}
  const formatted = formatUserPermissions(user)
  t.truthy(formatted)
})
