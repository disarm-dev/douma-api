import test from 'ava'

import {formatUserPermissions} from '../../../../src/v3/routes/authentication'

test('remove `read` and `write` properties', t => {
  const users = [
    {read: '1,2,4', write: '1,2,3'}
  ]

  const formatted = formatUserPermissions(users)

  const actual = formatted[0]

  t.is(actual.write, undefined)
  t.is(actual.read, undefined)

})

test('can handle empty array of users', t => {
  const users = []

  const formatted = formatUserPermissions(users)

  t.is(formatted.length, 0)
  t.true(Array.isArray(formatted))
})