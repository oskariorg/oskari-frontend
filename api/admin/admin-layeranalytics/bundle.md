# admin-layeranalytics

Admin UI for map layer problem tracker

## Description

This admin user-interface lists map layers that have received (anonymized) reports of problems from end-users browser.
The admin UI shows total number of loading events and error rate for the problematic layers.
The intention is to help admins notice configuration issues with layers registered on the Oskari instance.

*Note!* The data is collected by another bundle `layeranalytics` and it only collects data when an end-user encounters an error.
This bundle is only used to help admins analyze the collected data and is of no use if the data is not collected by the `layeranalytics` bundle (or some other means).

### Analyzing the data

From the listing the admin can see aggregated request count with error rate.
A detailed view is shown by clicking on the layer name.

The details include listing with:
- success/error counts per problem report
- when the issues have been reported
- link with the map location/zoom level the user used and other layers that were shown on the map when problems were encountered

These allow admins to try and reproduce the problem in an effort to understand what caused the issue.

#### High total count, low error rate

The layer configuration is probably ok. The service providing the layer might respond with an error if the user is looking at locations with no data on the layer/zoomed out of range etc.
Things to check:
- are zoom limits for the layer properly configured?
- does the layer have coverage bbox or is it correct?

#### High error rate

There's probably something wrong with the configuration.
Things to check:
- is the layer still available on the service it was registered from?
- if the layer is available, try using it on the map and errors from browsers console/network requests
- are zoom limits for the layer properly configured?

If the total count is high, end-users are trying to see this data but can't so this could be considered critical.
If the total count is low, end-users are trying to see this data but there's not much of them or most don't have problems so it's not as critical.
