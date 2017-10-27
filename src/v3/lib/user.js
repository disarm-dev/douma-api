const getCSV = require('get-csv')

let userList = []
let endpointPermissions = {}

function addPermission(method, path, permissions) {
    if (!endpointPermissions[method]) {
        endpointPermissions[method] = {}
    }
    if (!endpointPermissions[method][path]) {
        endpointPermissions[method][path] = []
    }

    endpointPermissions[method][path] = endpointPermissions[method][path].concat(permissions)
}

function checkPermission(user, method, path) {
    if (!endpointPermissions[method] || !endpointPermissions[method][path]) {
        return false
    }

    const allowedGroups = endpointPermissions[method][path]
    if (allowedGroups.includes('*')) {
        return true
    }

    if (!user) {
        return false
    }

    return allowedGroups.filter(group => user.permissions.includes(group)).length > 0
}

function updateUserList() {
    const path = process.env.SHEETS_URL || process.env.SHEETS_PATH
    console.log('Updating users list from:', path)
    return getCSV(path).then(parsedCSV => {
        userList = parsedCSV.map(user => {
            // Parse permissions
            user.write = user.write || ''
            user.read = user.read || ''
            const readPermissions = user.read.split(',').map(perm => 'read:' + perm.toLowerCase().trim())
            const writePermissions = user.write.split(',').map(perm => 'write:' + perm.toLowerCase().trim())
            user.permissions = readPermissions.concat(writePermissions)
            return user
        })
        return userList
    }).catch(err => {
        console.log('Failed to read CSV with error:', err)
    })
}

function findByApiKey(key) {
    const foundUsers = userList.filter(user => {
        return user.key === key
    })

    if (foundUsers.length > 0)  {
        return foundUsers[0]
    } else {
        return null
    }
}

function findByUsernamePassword(username, password) {
    const foundUsers = userList.filter(user => {
        return (user.username === username && user.password === password)
    })

    if (foundUsers.length > 0)  {
        return foundUsers[0]
    } else {
        return null
    }
}

function authMiddleware(req, res, next) {
    const openPaths = ['/v3/login', '/v3/auth']
    if (!openPaths.includes(req.path)) {
        const key = req.get('API-Key')
        if (key) {
            const user = findByApiKey(key)
            if (user) {
                req.user = user
                next()
            } else {
                res.status(401).send({message: 'User with this API key is not found.'})
            }
        } else {
            res.status(401).send({message: 'Please provide API-Key header with this request.'})
        }
    } else {
        next()
    }
}

function endpointPermissionsMiddleware(req, res, next) {
    if (checkPermission(req.user, req.method.toLowerCase(), req.path)) {
        next()
    } else {
        res.status(401).send({message: 'User does not have sufficient permissions to access this endpoint.'})
    }
}

function optionsMiddleware(req, res, next) {
    console.log('🚨 Check if user is authenticated, authorised, or has ANY permissions to do ANYTHING')

    // Must have a country (though need to TODO: @refac Rename to instance_slug or similar)
    if (!req.query.country) {
        res.status(400).send('Country parameter missing')
    } else {
        req.country = req.query.country

        // check if personalised_instance_id or set to default
        req.personalised_instance_id = req.query.personalised_instance_id || 'default'

        next()
    }
}

module.exports = {
    addPermission,
    checkPermission,
    updateUserList,
    findByApiKey,
    findByUsernamePassword,
    authMiddleware,
    endpointPermissionsMiddleware,
    optionsMiddleware,
}
