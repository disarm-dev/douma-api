
# Contents

- [Create new config](#create-new-config)
- [Updating an existing config](#updating-an-existing-config)
- [Get all configs](#get-all-configs)
- [Get A config](#get-a-config)

# Create New Config

**URL** : `/v7/config`

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
**URL** : `/v7/config/{config_id}`

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

**URL** : `/v7/config`

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

**URL** : `/v7/config/{config_id}`

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



# Create new geodata data

**URL** : `/v7/geodata/:instance/:spatial_hierarchy`

**Status** : DONE

To upload new geodata data from a geodata file

**Method** : `POST`

**Auth required** :  YES

**Permissions required** : \[ write:config\]

**Data constraints**

A valid geodata Data should have a geodata_id field which is a string,
waterline requires that documents have a primary key and it is used as a primary key

```json

    {<valid geodata data>}

```

## Success Responses

**Condition** : If provided `geodata_data` is valid .

**Code** : `201 Created`

**Response Content** 

## Error Response

**Condition** : If provided `geodata_data` is not valid .

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes





# Updating existing geodata
**URL** : `/v7/geodata/:instance/:spatial_hierarchy`


**Status** : DONE

To Update existing geodata data from a geodata file

**Method** : `POST`

**Auth required** : YES

**Permissions required** : \[ write:config \]

**Data constraints**

```json
{
   {<valid geodata data>}
}
```

## Success Responses

**Condition** : If provided `geodata_data` is valid and a record exists with the provide `geodata_id`.

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If provided `geodata_data` is not valid or the provided `geodata_id` does not belong to an existing geodata record .

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes



# Fetch all geodata data

**URL** : `/v7/geodata`


**Status** : DONE

To get all existing geodata data

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**


```json

```


## Success Responses

**Condition** : If `geodata_version` is not provided or the  provided `geodata_version` exists.

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If the provided `geodata_versin` does not exist.

**Code** : `400 BAD REQUEST`

**Content example** 

## Notes


# Get geodata data for a single jeojson file

**URL** : `/api/geodata/:instance/:spatial_hierarchy`


**Status** : TODO

To get geodata from a single geodata file, by id

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**



```json
{
    "geodata_version"
}
```

## Success Responses

**Condition** : If `geodata_version` is not provided or the  provided `geodata_version` exists
and a config with the config id exists.

**Code** : `200 OK`

**Response Content** 

## Error Response

**Condition** : If there is no config with the provided `geodata_id`  .

**Code** : `401 NOT FOUND`



# Get all geodata levels for an instance

**URL** : `/api/geodata/:instance`


**Status** : DONE

To get geodata levels from an instance

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints**



```json

```

## Success Responses

**Condition** : If `geodata_version` is not provided or the  provided `geodata_version` exists
and a config with the config id exists.

**Code** : `200 OK`

**Response Content example**

```json
['country','village']
```

## Error Response

**Condition** : If there is no config with the provided `geodata_id`  .

**Code** : `401 NOT FOUND`
