const {validate, errors} = require('@locational/application-registry-validation')

async function validate_midleware(req, res, next) {
    if (validate(req.body.config_data)) {
        next()
    } else {
        let error_list = errors((req.body.config_data))
        console.log(error_list)
        res.status(400).send(error_list)
    }
}

module.exports = {validate_midleware}