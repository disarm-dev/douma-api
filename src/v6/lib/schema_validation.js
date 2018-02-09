const Ajv = require('ajv')
const case_cluster_schema = require('./schemas/case_cluster_schema')

const ajv = new Ajv()


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

module.exports = {
    validate_case_cluster,
    validate_case_clusters
}




