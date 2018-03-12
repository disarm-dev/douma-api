
# Contents

- [Create new config](#create-new-config)
- [Updating an existing config](#updating-an-existing-config)
- [Get all configs](#get-all-configs)
- [Get A config](#get-a-config)

# Create New Config

**URL** : `/api/config/`

**Status** : Done

To create a new config

**Method** : `POST`

**Auth required** : YES

**Permissions required** : \[write:config\]

**Data constraints**

```json
{
    "config_data": {<config data>}
}
```

## Success Responses

**Condition** : If the provided `config_data` is valid .

**Code** : `201 Created`

**Response Content** 

## Error Response

**Condition** : If the provided `config_data` is not valid .

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes



# Updating an existing config
**URL** : `/api/config/{config_id}`

**Status** : Done


To Update an existing config

**Method** : `POST`

**Auth required** : Yes

**Permissions required** : \[write:config\]

**Data constraints**

```json
{
    "config_data": {<config data>}
}
```

## Success Responses

**Condition** : If the provided `config_data` is valid .

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If the provided `config_data` is not valid .

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes



# Get all configs

**URL** : `/api/config`

**Status** : Done

To get all existing configs

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**


```json
{
    "config_version": {<config data>}
}
```

## Success Responses

**Condition** : If `config_version` is not provided or the  provided `config_version` exists.

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If the provided `config_versin` does not exist.

**Code** : `400 BAD REQUEST`

**Content example** 

```json
[
  {
    "config_id":"Config Id",
    "config_version":"Config Version"
  }
  ...
]
```

## Notes


# Get A config

**URL** : `/api/config/{config_id}`

**Status** : Done
 
To get an existing config by ID

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**



```json
{
    "config_version": "[config version]"
}
```

## Success Responses

**Condition** : If `config_version` is not provided or the  provided `config_version` exists
and a config with the config id exists.

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If there is no config with the provided `config_id`  .

**Code** : `401 NOT FOUND`


**Condition** : If the provided `config_versin` does not exist .

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes



# Create new GEOJSON data

**URL** : `/api/geojson/:instance/:spatial_hierarchy`

**Status** : DONE

To upload new geojson data from a geojson file

**Method** : `POST`

**Auth required** :  YES

**Permissions required** : \[ write:admin\]

**Data constraints**

A valid GEOJSON Data should have a geojson_id field which is a string,
waterline requires that documents have a primary key and it is used as a primary key

```json

    {<valid geojson data>}

```

## Success Responses

**Condition** : If provided `geojson_data` is valid .

**Code** : `201 Created`

**Response Content** 

## Error Response

**Condition** : If provided `geojson_data` is not valid .

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes





# Updating existing GEOJSON
**URL** : `/api/geojson/{geojson_id}`


**Status** : TODO

To Update existing geojson data from a geojson file

**Method** : `POST`

**Auth required** : YES

**Permissions required** : \[ write:admin \]

**Data constraints**

```json
{
    "geojson_data": {<valid geojson data>}
}
```

## Success Responses

**Condition** : If provided `geojson_data` is valid and a record exists with the provide `geojson_id`.

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If provided `geojson_data` is not valid or the provided `geojson_id` does not belong to an existing GEOJSON record .

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes



# Fetch all GEOJSON data

**URL** : `/api/geojson`


**Status** : DONE

To get all existing GEOJSON data

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**


```json

```


## Success Responses

**Condition** : If `geojson_version` is not provided or the  provided `geojson_version` exists.

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If the provided `geojson_versin` does not exist.

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes


# Get GEOJSON data 

**URL** : `/api/geojson/:instance/:spatial_hierarchy`


**Status** : TODO

To get GEOJSON from a single GEOJSON file, by id

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**



```json
{
    "geojson_version"
}
```

## Success Responses

**Condition** : If `geojson_version` is not provided or the  provided `geojson_version` exists
and a config with the config id exists.

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If there is no config with the provided `geojson_id`  .

**Code** : `401 NOT FOUND`



# Get all geojson levels for an instance

**URL** : `/api/geojson/:instance`


**Status** : DONE

To get GEOJSON levels from an instance

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**



```json

```

## Success Responses

**Condition** : If `geojson_version` is not provided or the  provided `geojson_version` exists
and a config with the config id exists.

**Code** : `200 OK`

**Response Content example**

```json
['country','village']
```

## Error Response

**Condition** : If there is no config with the provided `geojson_id`  .

**Code** : `401 NOT FOUND`
