const model = require('./model')
module.exports = {
    input: {
        "title": "cases",
        "type": "array",
        "items": {
            "type": "object",
            "required": ["geometry"],
            "properties": {
                "_id": {
                    "type": "string"
                },
                "geometry": {
                    "type": "object",
                    "required": [
                        "type",
                        "coordinates"
                    ],
                    "oneOf": [
                        {
                            "title": "Point",
                            "properties": {
                                "type": {
                                    "enum": [
                                        "Point"
                                    ]
                                },
                                "coordinates": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "number"
                                        }
                                    ],
                                    "additionalItems": false
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    output: {
        "title": "cluster",
        "type": "object",
        "properties": {
            "geometry": {
                "type": "object",
                "propertirs": {
                    "coordinates": {
                        "type": "array",
                        "items": [
                            {
                                "type": "array",
                                "items": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    },
    fn: model
}