# Contents

- [Create new conf](#create-new-config)

# Get case custers

**URL** : `/api/v6/cluster/`

**Status** : TODO

To fetch case clusters

**Method** : `GET`

**Auth required** : YES

**Permissions required** : read

**Data constraints**

The format can be url_encoded

```
{
    "country" {<country_id>}
}
```

## Success Responses

**Condition** : If the provided `country` is valid .

**Code** : `200 Success`

**Response Content** 

```json
[
  {
    ...
    lat,
    lng,
    cluster_id
  }
]
```

## Error Response

**Condition** : If the provided `contry` is not valid .

**Code** : `404 NOT FOUND`

## Notes

# Create a case cluster

**URL** : `/api/v6/cluster/`

**Status** : TODO

To Create a new Cluster

**Method** : `POST`

**Auth required** : YES

**Permissions required** : write

**Data constraints**

The format can be json

```
{
    "country":{<country_id>},
     "cluster_data":{<cluster_data>}    
}
```

## Success Responses

**Condition** : If the provided `country`  and `cluster_data` is valid .

**Code** : `201 Created`

**Response Content** 

```json
[
  {
    cluster_id
  }
]
```

## Error Response

**Condition** : If the provided `contry` is not valid .

**Code** : `400 BAD REQUEST`

## Notes

# Update a case cluster

**URL** : `/api/v6/cluster/cluster_id`

**Status** : TODO

To Create a new Cluster

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : write

**Data constraints**

The format can be json

```
{
    "country":{<country_id>},
     "cluster_data":{<cluster_data>}    
}
```

## Success Responses

**Condition** : If the provided `country`  and `cluster_data` is valid .

**Code** : `200 Success`

**Response Content** 

```json
[
  {
    cluster_id
  }
]
```

## Error Response

**Condition** : If the provided `contry` is not valid or the cluster_id is not found.

**Code** : `404 NOT FOUND`

## Notes
