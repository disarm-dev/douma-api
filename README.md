# DOUMA API

[![coverage report](https://gitlab.com/disarm/douma.api/badges/master/coverage.svg)](https://gitlab.com/disarm/douma.api/commits/master)

## Dev

Install `rerun` Gem, using `gem install rerun`, or pick another way to reload server.

## Documentation

See http://douma-api-docs.disarm.io

## Running locally

Need to set `MONGODB_URI` as an environment variable. It's a secret, so it's not in here. But depending on where it's hosted and where the DB is, it looks something like `mongodb://heroku_xxxxxxxx:xxxxxxxxxx@xxxxxxx.mlab.com:35000/xxxxxxxx`

## Deployment

### Required software

1. Download and install nodejs (https://nodejs.org/en/download/)
2. Download and install mongodb (https://docs.mongodb.com/manual/installation/)
3. Start mongodb server process
4. Clone this repository (git clone https://gitlab.com/disarm/douma.api douma-api)

### Configuration

1. Set MONGODB_URI environment variable to URI of your mongodb installation.
For local installation that could be:
```
mongodb://localhost/douma
```
2. Set SHEETS_URL environment variable to URI of your users CSV file if you store it remotely.
Alternatively use SHEETS_PATH environment variable to point to CSV file in your local filesystem.

3. Go to douma-api directory and install node packages:
```
npm install
```


### Starting the server
1. Start the server:
```
npm run start
```
