const Ajv = require('ajv')
const case_cluster_schema = require('./schemas/case_cluster_schema')
const case_location_schema = require('./schemas/case_locations_schema')

const ajv = new Ajv()

const case_location_validate = ajv.compile(case_location_schema);



function validate_case_clusters(case_clusters) {
    for (const case_cluster of case_clusters) {
        if (!ajv.validate(case_cluster_schema, case_cluster)) {
            throw ajv.errors
        }
    }
}

function validate_case_cluster(case_cluster) {
    const validation = ajv.validate(case_cluster_schema, case_cluster)
    if (!validation) {
        throw ajv.errors
    } else {
        return validation
    }
}



function validate_case_locations(case_locations) {
    for (const case_location of case_locations) {
        validate_case_location(case_location)
    }
}

function validate_case_location(case_location) {
    const validation = case_location_validate(case_location)
    if (!validation) {
        throw ajv.errors
    } else {
        return validation
    }
}




module.exports = {
    validate_case_cluster,
    validate_case_clusters,
    validate_case_location,
    validate_case_locations
}




