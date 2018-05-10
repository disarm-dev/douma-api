const md5 = require('md5')

const getCSV = require('get-csv')

// In memory cache of all known users
let userList = []
// In memory cache of all endpoint permissions
let endpointPermissions = {}

/*
 * Adds a new permission rule to the route.
 * Adding a new permission rule is effectively whitelisting a route for users that have corresponding permission.
 *
 * @param method      HTTP method of the route
 * @param path        URI of the route
 * @param permissions An array of permission rules
 */
function addPermission(method, path, permissions) {
    if (!endpointPermissions[method]) {
        endpointPermissions[method] = {}
    }
    if (!endpointPermissions[method][path]) {
        endpointPermissions[method][path] = []
    }

    endpointPermissions[method][path] = endpointPermissions[method][path].concat(permissions)

}

/*
 * Checks if the route is accessible for given user.
 *
 * @param user   User object
 * @param method HTTP method of the route
 * @param path   URI of the route
 */
function checkPermission(user, method, path) {

    let _path = Object.keys(endpointPermissions[method])
        .filter(i => path.startsWith(i)&&i!=='/')
        .filter(i => i.length)[0]

    path = _path&&_path!=='/' ? _path : path

    console.log('Path ', path,_path, 'Endpoint Permissions', user)

    if (!endpointPermissions[method] || !endpointPermissions[method][path]) {
        console.log('Condition 1 fail', method, path)
        return false
    }

    const allowedGroups = endpointPermissions[method][path]
    if (allowedGroups.includes('*')) {

        return true
    }

    if (!user) {
        console.log('Condition 3 fail')
        return false
    }

    return allowedGroups.some(group => user.permissions.includes(group))
    //  console.log('Final Result ', final_result)

}

/*
 * Parses users CSV file and populates in-memory cache of users
 * Dynamically generates API keys for all users based on md5 of their properties.
 * API keys will change only if user properties in corresponding CSV change.
 */
function updateUserList() {
    const path = process.env.SHEETS_URL || process.env.SHEETS_PATH
    //console.log('Updating users list from:', path)
    return getCSV(path).then(parsedCSV => {
        userList = parsedCSV.map(user => {
            // Parse permissions
            user.write = user.write || ''
            user.read = user.read || ''
            const readPermissions = user.read.split(',').map(perm => 'read:' + perm.toLowerCase().trim())
            const writePermissions = user.write.split(',').map(perm => 'write:' + perm.toLowerCase().trim())
            const derivedPermissions = user.write.split(',').map(perm => 'read:' + perm.toLowerCase().trim())

            const allPermissions = readPermissions.concat(writePermissions).concat(derivedPermissions)
            const uniquePermissions = allPermissions.reduce((acc, rule) => {
                if (!acc.includes(rule)) {
                    acc.push(rule)
                }
                return acc
            }, [])
            user.permissions = uniquePermissions


            // Generate allowed apps
            user.allowed_apps = {
                read: user.read.split(',').map(t => t.toLowerCase().trim()),
                write: user.write.split(',').map(t => t.toLowerCase().trim())
            }

            // Generate key
            user.key = md5(process.env.SECRET + user.username + user.password + user.read + user.write + user.instance_slug)
            console.log('Created user', user.username, user.key)

            return user
        })
        return userList
    }).catch(err => {
        console.log('Failed to read CSV with error:', err)
    })
}

/*
 * Find user by their API key.
 */
function findByApiKey(key) {
    const foundUsers = userList.filter(user => {
        return user.key === key
    })

    if (foundUsers.length > 0) {
        return foundUsers[0]
    } else {
        return null
    }
}

/*
 * Find user by their username and password
 */
function findByUsernamePassword(username, password) {
    const foundUsers = userList.filter(user => {
        return (user.username === username && user.password === password)
    })

    if (foundUsers.length > 0) {
        return foundUsers[0]
    } else {
        return null
    }
}

/*
 * Express middleware that checks the API key provided by client in request headers.
 * The key should be passed in 'API-Key' header with every request.
 * If API key was provided and we found a corresponding user, all subsequent middleware
 * will have access to user object in the request.
 */
function authMiddleware(req, res, next) {
    const openPaths = ['/login', '/', '/refresh_users']
    if (openPaths.includes(req.path)) return next()

    //TODO : Implement a generic solution for enabling arbitrary paths for specific HTTP verbs
    if (req.path.startsWith('/config') && req.method === 'GET') return next()

    const key = req.get('API-Key')
    if (!key) return res.status(401).send({message: 'Please provide API-Key header with this request.'})

    const user = findByApiKey(key)
    if (!user) return res.status(401).send({message: 'Current API key is not valid. Please log out and try to login again.'})

    // In case everything succeeds
    req.user = user
    return next()
}

/*
 * Checks if current user has sufficient permissions to access current enpoint
 */
function endpointPermissionsMiddleware(req, res, next) {
    if (checkPermission(req.user, req.method.toLowerCase(), req.path)) {
        next()
    } else {
        res.status(401).send({message: 'User does not have sufficient permissions to access this endpoint.'})
    }
}

/*
 * Checks if request has required query parameters
 */
function optionsMiddleware(req, res, next) {
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

function forceUpdateUserList(req, res) {
    updateUserList().then(() => {
        const message = 'Successful update of userList'
        res.send(message)
    })
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
    forceUpdateUserList
}
