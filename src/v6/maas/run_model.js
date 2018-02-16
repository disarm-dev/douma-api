const input = require('./input')
const {validate_input, validate_output} = require('./validation')

module.exports = async ({input,config}) => {
    try {
        let validation = validate_input(input, config)
        result = await config.fn(input) // TODO validate Output
        validate_output(result, config)
        return result
    } catch (e) {
        throw(e)
    }
}

