const Ajv = require('ajv')
const validate = schema => data => {
    let ajv = new Ajv()
    let validate = ajv.compile(schema)
    let valid = validate(data)
    console.log(valid)
    if (valid) {

        return valid
    }else{
        console.log(validate.errors)
        throw(ajv.errors)

    }

}


const validate_input = (stdin, config) => {
   // console.log('Validating input',stdin[0].geometry)
    validate(config.input)(stdin)
}

const validate_output = (output, config) => {
   // console.log('Validation Output')
    validate(config.output)(output)
}

module.exports = {
    validate_input,
    validate_output
}