# Platypus [![Build Status](https://snap-ci.com/automonkey/platypus/branch/master/build_image)](https://snap-ci.com/automonkey/platypus/branch/master)

Web service providing basic next train info for UK National Rail train journeys. Uses National Rail Online Journey Planner API[1] to provide basic time and platform info for the next few journeys between two stations.

## Execution

The following environment variables exist and should be configured prior to execution:

| Variable         | Usage                                               | Required? | Default |
| ---------------- | --------------------------------------------------- | --------- | ------- |
| PORT             | Port number to listen on                            | N         | 3000    |
| GA_TRACKING_CODE | Google Analytics tracking code to use for events    | N         |         |
| GA_DOMAIN        | Google Analytics tracking domain to use for events  | N         |         |
| OJP_USER         | Username for the ojp.nationalrail.co.uk web service | Y         |         |
| OJP_PASS         | Password for the ojp.nationalrail.co.uk web service | Y         |         |
| APP_DYNAMICS_CONTROLLER_HOST_NAME | App Dynamics account controller host name | N | |
| APP_DYNAMICS_ACCOUNT_NAME | App Dynamics account name | N | |
| APP_DYNAMICS_ACCOUNT_ACCESS_KEY | App Dynamics account access key | N | |
| APP_DYNAMICS_APP_NAME | App Dynamics app name | N | |
| APP_DYNAMICS_TIER_NAME | App Dynamics tier name | N | |

To execute the web service run:

`npm start`

## Usage

The service accepts URLS of multiple forms:

### Single destination

`http://host/originStation/destinationStation`

For example:

`http://localhost:3000/vic/bug`

### Multiple destinations

`http://host/originStation?destinations=destinationStations`

Where destinationStations is a comma seperated list.

For example:

`http://localhost:3000/vic?destinations=wvf,bug`

## Running tests

To execute the unit tests run:

`npm test`

To execute the integration tests (will need required environment variables set) run:

`npm run-script integration-test`

## Running linter

To execute the linter run:

`npm run-script lint`


[1] http://www.nationalrail.co.uk/100299.aspx

