
# List all plans

**URL** : `/v6/plan/all`

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
<List of Plans >
]
```

## Error Response

**Condition** : If the user does not have the required permissions .

**Code** : `401 BAD REQUEST`

**Condition** : If something unknown happened and the database returns an error .

**Code** : `500 INTERNAL SERVER ERROR`

## Notes
- There is no validation of the plans before they are sent to the client.

