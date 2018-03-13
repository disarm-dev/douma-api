import test from 'ava'
import {
    addPermission,
    checkPermission,
    updateUserList,
    findByApiKey,
    findByUsernamePassword
} from '../../../src/v4/lib/auth'

test ('addPermission', async t => {
    t.plan(5)
    const userList = await updateUserList()
    const admin = userList[0]
    const novice = userList[2]

    addPermission('get', '/plan/current', ['read:irs_plan', 'read:irs_tasker'])
    addPermission('post', '/plan/create', ['write:irs_plan'])

    t.true(checkPermission(admin, 'get', '/plan/current'))
    t.false(checkPermission(admin, 'post', '/plan/current'))

    t.true(checkPermission(admin, 'post', '/plan/create'))

    t.false(checkPermission(novice, 'get', '/plan/current'))
    t.false(checkPermission(novice, 'post', '/plan/create'))
})

test('updateUserList', async t => {
    t.plan(5)
    const userList = await updateUserList()

    t.is(userList.length, 6)

    const powerUser = userList[1]
    t.true(powerUser.permissions.includes('read:irs_plan'))
    t.true(powerUser.permissions.includes('read:irs_tasker'))
    t.true(powerUser.permissions.includes('write:irs_tasker'))
    t.true(!powerUser.permissions.includes('write:irs_plan'))
})

test('findByApiKey', async t => {
    t.plan(2)
    const userList = await updateUserList()

    // Trying to find user by wrong key
    t.is(findByApiKey('wrongkey'), null)
    // Finding existing user
    t.deepEqual(findByApiKey(userList[0].key), userList[0])
})

test('findByUsernamePassword', async t => {
    t.plan(2)
    const userList = await updateUserList()

    // Trying to find user by wrong key
    t.is(findByUsernamePassword({username: 'nosuch', password: 'user'}), null)
    // Finding existing user
    const user = userList[0]
    t.deepEqual(findByUsernamePassword(user.username, user.password), user)
})


