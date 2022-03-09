# layeranalytics

Map layer problem tracker

## Description

Listens to map layer loading events from the map module to make an effort for detecting problems with layer configurations.
If there is an error when a map layer is being loaded for the end-user the bundle collects a dataset consisting of ids of used layers and map location.
The dataset is sent to the server when the user exits the page so the issue can be further analysed by admins and possible issue in layer configuration can be corrected for other users.
