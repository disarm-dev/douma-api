const input = require('./input')
const config = require('./model')
const {validate_input,validate_output} = require('./validation')

const run_model = async ({input, config}) => {
    try {
        let validation = validate_input(input, config)
        result = await config.fn(input) // TODO validate Output
        //validate_output(result, config)
        return result
    } catch (e) {
        throw(e)
    }
}

module.exports = {
    run_model
}
