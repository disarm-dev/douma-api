# DOUMA API

[![coverage report](https://gitlab.com/disarm/douma.api/badges/master/coverage.svg)](https://gitlab.com/disarm/douma.api/commits/master)

## Deployment

This is the server for DiSARM. Users will require access to a configured and deployed [client application](https://gitlab.com/disarm/douma-app).

### Required software

1. Download and install nodejs (https://nodejs.org/en/download/)
2. Download and install mongodb (https://docs.mongodb.com/manual/installation/)
3. Start mongodb server process
4. Clone this repository (`git clone https://gitlab.com/disarm/douma.api douma-api`)

### Configuration

1. Set `MONGODB_URI` environment variable to URI of your mongodb installation.
For local installation that could be:
```
mongodb://localhost/douma
```
2. Set `SHEETS_URL` environment variable to URI of your users CSV file if you store it remotely.
Alternatively use `SHEETS_PATH` environment variable to point to CSV file in your local filesystem.

3. Go to douma-api directory and install node packages:
```
npm install
```


### Starting the server
1. Start the server:
```
npm run start
```


## Managing users

By default, users are configured in the `users.csv` file. Please restart after changing this file.

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

## Development

Need the same configuration as for production (see above). 

Install `rerun` Gem, using `gem install rerun`, or pick another way to reload server.
