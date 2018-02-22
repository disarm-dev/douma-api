module.exports = {
    "schema": "http://json-schema.org/draft-07/schema#",
    "title": "Case location",
    "type": "object",
    "properties": {
        "_id": {
            "type": "string",
            "minLength": 24,
            "maxLength": 24
        },
        "geometry": {
        }
    },
    "required": ["_id", "geometry"]
}