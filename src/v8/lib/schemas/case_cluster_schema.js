module.exports = {
    "title": "Case cluster",
    "type": "object",
    "properties": {
        "_id": {
            "type": "string"
        },
        "investigation_status": {
            "type": "string",
            "enum": [
                "investigated",
                "suggested",
                "visual review"
            ]
        },
        "status": {
            "type": "string",
            "enum": [
                "active",
                "inactive",
                "cleared"
            ]
        },
        "geometry": {
            "type": "object"
        }
    },
    "required": ["status", "investigation_status", "geometry"]
}