const User = require('../lib/user')

module.exports = {
    login: function(req, res) {
        const cred = req.body
        if (cred.username && cred.password) {
            const user = User.findByUsernamePassword(cred.username, cred.password)
            if (user) {
                res.status(200).send({username: user.username, key: user.key})
            } else {
                res.status(404).send({message: 'User with this login or password is not found.'})
            }
        } else {
            res.status(400).send({message: 'Need both login and password fields.'})
        }
    }
}
