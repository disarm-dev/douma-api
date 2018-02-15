const Ajv = require('ajv')
const validate = schema => data => {
    let ajv = new Ajv()
    let is_valid = ajv.compile(schema)(data)
    if (is_valid) {
        return is_valid
    }
    throw(ajav.errors)
}
const validate_input = (stdin, config) => {
    validate(config.input)(stdin)
}

const validate_output = (output, config) => {
    validate(config.output)(output)
}

module.exports = {
    validate_input,
    validate_output
}