
# List all plans

**URL** : `/v6/plan/list`

**Status** : DONE

To get all plans for an instance

**Method** : `GET`

**Auth required** : YES

**Permissions required** : `['read:irs_plan', 'read:irs_monitor', 'read:irs_tasker']`

**Data constraints**
url-encoded data

` country=<country> `

json-encoded data

``` json

```

## Success Responses

**Condition** : If the user has there required permissions .

**Code** : `200`

**Response Content**

```json
[
<{
 _id, //plan id
 targets, //Number of targets
 date // Update date
 }>
]
```

## Error Response

**Condition** : If the user does not have the required permissions .

**Code** : `401 BAD REQUEST`

**Condition** : If something unknown happened and the database returns an error .

**Code** : `500 INTERNAL SERVER ERROR`

## Notes
- There is no validation of the plans before they are sent to the client.


# Get A single specific plan

**URL** : `/v6/plan/detail/:plan_id`

**Status** : DONE

To get one specific plan using the plan id

**Method** : `GET`

**Auth required** : YES

**Permissions required** : `Every one who is logged in`

**Data constraints**
url-encoded data

` country=<country> `

json-encoded data

``` json

```

## Success Responses

**Condition** : If the plan with the requested id exists .

**Code** : `200`

**Response Content**

```json
[
<Olan data >
]
```

## Error Response

**Condition** : If the requested id does not belong to an existing plan .

**Code** : `404 NOT FOUND`

**Condition** : If something unknown happened and the database returns an error .

**Code** : `500 INTERNAL SERVER ERROR`

## Notes
- There is no validation of the plan before it is sent to the client.

