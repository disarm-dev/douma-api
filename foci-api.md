# Contents


# Get case custers

**URL** : `/v6/foci/cluster`

**Status** : TODO

To fetch case clusters

**Method** : `GET`

**Auth required** : YES

**Permissions required** : read:foci

**Data constraints**

The format can be url_encoded

` country=<country_id>`

## Success Responses

**Condition** : If the provided `country` is valid .

**Code** : `200 Success`

**Response Content Example**

```json
[
{
       "id": "2949c6b9-b388-43aa-9a5b-2ea2ea899c00",
       "cases": "94",
       "status": "investigated",
       "geometry": {
         "type": "Polygon",
         "coordinates": [
           [
             [
               31.43463134765625,
               -25.89134949832312
             ],
             [
               31.451110839843746,
               -25.869109390999295
             ],
             [
               31.43463134765625,
               -25.84439325019513
             ]

           ]
         ]
       }
     }
]
```

## Error Response

**Condition** : If the provided `contry` is not valid .

**Code** : `404 NOT FOUND`

## Notes



# Create a case cluster

**URL** : `/v6/foci/cluster`

**Status** : TODO

To Create a new Cluster

**Method** : `POST`

**Auth required** : YES

**Permissions required** : write:foci

**Data constraints**
url-encoded data

` country=<country> `

json-encoded data

``` json

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

**URL** : `/v6/foci/cluster`

**Status** : TODO

To Create a new Cluster

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : write:foci

**Data constraints**

Data formated with url-encoded

`country=<country>`


json-formated data example

```json
{
  {
         "id": "2949c6b9-b388-43aa-9a5b-2ea2ea899c00",
         "cases": "94",
         "status": "investigated",
         "geometry": {
           "type": "Polygon",
           "coordinates": [
             [
               [
                 31.43463134765625,
                 -25.89134949832312
               ],
               [
                 31.451110839843746,
                 -25.869109390999295
               ],
               [
                 31.43463134765625,
                 -25.84439325019513
               ]

             ]
           ]
         }
       }
}
```

## Success Responses

**Condition** : If the provided `country`  and `cluster_data` is valid .

**Code** : `200 Success`

**Response Content Example**

```json
{
    "n": 1,
    "nModified": 1,
    "ok": 1
}

```

## Error Response

**Condition** : If the provided `country` is not valid or the cluster data is not found.

**Code** : `404 NOT FOUND`

## Notes





# Get cases

**URL** : `/v6/foci/case`

**Status** : TODO

To fetch case clusters

**Method** : `GET`

**Auth required** : YES

**Permissions required** : read:foci

**Data constraints**
url-encoded data

    `country=<country_id>`


## Success Responses

**Condition** : If the provided `country` is valid .

**Code** : `200 Success`

**Response Content**

```json
[
    {
        "_id": "5a785d9822725112f168fdea",
        "id": "f8275210-60af-410b-a621-d97a4e113fa3",
        "geometry": {
            "type": "Point",
            "coordinates": [
                31.243057250976562,
                -25.867873706693747
            ],
        },
        "personalised_instance_id": "default",
        "updated_at": 1517838820584
    }
]
```

## Error Response

**Condition** : If the provided `country` is not valid .

**Code** : `404 NOT FOUND`

## Notes

# Create a case cluster

**URL** : `/v6/foci/case`

**Status** : TODO

To Create a new Case

**Method** : `POST`

**Auth required** : YES

**Permissions required** : write:foci

**Data constraints**

url-encoded data

`country=<country>`

json-encoded data example

```
  {
    "id": "f8275210-60af-410b-a621-d97a4e113fa3",
    "geometry": {
      "type": "Point",
      "coordinates": [
        31.243057250976562,
        -25.867873706693747
      ]
    }
  }
```

## Success Responses

**Condition** : If the provided `country`  and `cluster_data` is valid .

**Code** : `201 Created`

**Response Content**

```json
{"n":1,"ok":1}
```

## Error Response

**Condition** : If the provided `contry` is not valid .

**Code** : `400 BAD REQUEST`

## Notes

# Update a case

**URL** : `/v6/foci/case`

**Status** : TODO

To Create a new case

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : write:foci

**Data constraints**

url-encoded data

`country=<country>`

The format can be json

```
  {
    "id": "4f74c2c2-ea39-4f13-a5c2-59c2187e4d54",
    "geometry": {
      "type": "Point",
      "coordinates": [
        31.196880340576172,
        -25.931031499716866
      ]
    }
  }
```

## Success Responses

**Condition** : If the provided `country`  and case data is valid .

**Code** : `200 Success`

**Response Content**

```json
{"n":1,"nModified":1,"ok":1}
```

## Error Response

**Condition** : If the provided `contry` is not valid or the case data's id  is not found.

**Code** : `404 NOT FOUND`

## Notes



# Case cluster count

**URL** : `/v6/foci/number_of_clusters`

**Status** : DONE

To get the number of clusters in the backend

**Method** : `GET`

**Auth required** : YES

**Permissions required** : read:foci

**Data constraints**

url-encoded data

`country=<country>`

## Success Responses

**Condition** : If the provided `country`  and case data is valid .

**Code** : `200 Success`

**Response Content**

```json
{
    "count":1
}
```

## Error Response

**Condition** : If there was an internal error.

**Code** : `501 INTERNAL ERROR`

## Notes

# Case count

**URL** : `/v6/foci/number_of_cases`

**Status** : DONE

To get the number of clusters in the backend

**Method** : `GET`

**Auth required** : YES

**Permissions required** : read:foci

**Data constraints**

url-encoded data

`country=<country>`

## Success Responses

**Condition** : If the provided `country`  and case data is valid .

**Code** : `200 Success`

**Response Content**

```json
{
    "count":1
}
```

## Error Response

**Condition** : If there was an internal error.

**Code** : `501 INTERNAL ERROR`

## Notes

