# DOUMA API

[![coverage report](https://gitlab.com/disarm/douma.api/badges/master/coverage.svg)](https://gitlab.com/disarm/douma.api/commits/master)

## Deployment

This is the server for DiSARM. Users will require access to a configured and deployed [client application](https://gitlab.com/disarm/douma-app).

### Required software

1. Download and install nodejs (https://nodejs.org/en/download/)
2. Download and install mongodb (https://docs.mongodb.com/manual/installation/)
3. Start mongodb server process
4. Clone this repository (`git clone https://gitlab.com/disarm/douma.api douma-api`)
5. 

### Required domain

The client application is served over HTTPS, so any requests made (e.g. to this API) must also be served from a domain using HTTPS. 
For core instance servers, DiSARM can make a proxy server available.

The domain name needs to be provided to the client application. 

It's possible to automatically configure it via a URL parameter, something like `https://zwe-mats.api.disarm.io#api_url=https://zwe.api.disarm.io`. 
This assumes the API server is available through `https://zwe.api.disarm.io`

### Configuration

1. Go to douma-api directory and install node packages:
```
npm install
```

2. Set `SECRET` environment variable to any string. It will be used for user API keys generation.

3. Set `MONGODB_URI` environment variable to URI of your mongodb installation.
For local installation that could be:
```
mongodb://localhost/douma
```
4. Set `SHEETS_URL` environment variable to URI of your users CSV file if you store it remotely.
Alternatively use `SHEETS_PATH` environment variable to point to CSV file in your local filesystem.


### Starting the server
1. Start the server:
```
npm run start
```


## Managing users

You will need to create `users.csv` file with all your users. Make sure to set either SHEETS_URL or SHEETS_PATH environment variable.
Make sure to restart the server after changing the `users.csv` file.

### Required columns and types
The following are required:
- _`id` {String} can be anything (e.g. same as username), but must be unique 
- `name` {String} - used for display
- `password` {String} - no minimum requirements
- `username` {String} - should be unique, can be the same as `_id`
- `read` - {String} - comma-separated list of applets the user has read permissions for (see below for list) 
- `write` {String} - comma-separated list of applets the user has write permissions for (see below for list)
- `instance_slug` - {String} - provided by maintainers of DOUMA app 

### List of applets
- `irs_monitor` (dashboard)
- `irs_plan` (planning tool)
- `irs_tasker` (tasking and team assignment)
- `irs_record_point` (data collection)
- `debug` (debugging features)

## Database admin and backups

Please ensure sound practices are in place for backing up data.

## Development

Need the same configuration as for production (see above). 

Install `rerun` Gem, using `gem install rerun`, or pick another way to reload server.


## Public paths

Need to

1. Include in `openPaths` array
2. Ensure the path is referenced in an `addPermissions` call, with a wildcard permission: e.g. `addPermission('get', v(''), ['*'])` 

