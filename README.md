# Platypus

Web service providing basic next train info for UK National Rail train journeys. Uses National Rail Online Journey Planner API[1] to provide basic time and platform info for the next few journeys between two stations.

## Execution

The following environment variables exist and should be configured prior to execution:

| Variable      | Usage                                               | Default |
| ------------- | --------------------------------------------------- | ------- |
| PORT          | Port number to listen on                            | 3000    |
| OJP_USER      | Username for the ojp.nationalrail.co.uk web service |         |
| OJP_PASS      | Password for the ojp.nationalrail.co.uk web service |         |

To execute the web service run:

`npm run-script start`

## Usage

The service accepts URLS of the form:

`http://host/:originStation/:destinationStation`

For example:

`http://localhost:3000/vic/bug`


[1] http://www.nationalrail.co.uk/100299.aspx

