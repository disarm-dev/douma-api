
# Get Date Filtered Records

**URL** : `/v7/record/filtered`

**Status** : DONE

To get one specific plan using the plan id

**Method** : `GET`

**Auth required** : YES

**Permissions required** : `Every one who is logged in`

**Data constraints**
url-encoded data

` country=<country> `

json-encoded data

``` urlencode
start_date = <date string>&end_date = <date string>

```

## Success Responses

**Condition** : If the plan with the requested id exists .

**Code** : `200`

**Response Content**

```json
[
<Responses data >
]
```

## Error Response


**Condition** : If something unknown happened and the database returns an error .

**Code** : `500 INTERNAL SERVER ERROR`

## Notes
- There is no validation of the responses before they are sent to the client.

