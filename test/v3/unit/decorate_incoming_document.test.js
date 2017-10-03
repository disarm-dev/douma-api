import test from 'ava'
import {decorate_incoming_document} from '../../../src/v3/lib/decorate_incoming_document'

test('user is set on doc', t => {
  const req = {
    user: 'username'
  }
  const doc = {}

  const actual = decorate_incoming_document({doc, req})

  t.is(actual.user, 'username')
})


test('personalised_instance_id is set on doc', t => {
  const req = {
    personalised_instance_id: 'myid'
  }
  const doc = {}

  const actual = decorate_incoming_document({doc, req})

  t.is(actual.personalised_instance_id, 'myid')
})

test('updated_at is set', t => {
  const req = {}
  const doc = {}

  const decorated = decorate_incoming_document({doc, req})

  const actual = decorated.updated_at

  t.true(Number.isInteger(actual))

  t.true(new Date(actual) instanceof Date)
})