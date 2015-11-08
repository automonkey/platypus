# Platypus

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

To execute the web service run:

`npm run-script start`

## Usage

The service accepts URLS of the form:

`http://host/:originStation/:destinationStation`

For example:

`http://localhost:3000/vic/bug`

## Running tests

To execute the tests run:

`npm run-script test`


[1] http://www.nationalrail.co.uk/100299.aspx

