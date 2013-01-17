# Map Publisher

|| Name || Map publisher ||
|| ID || publisher ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.publisher.PublisherBundleInstance link] ||

### Description

This Bundle provides functionality to define an embeddable map and save it to server so it can be published on another page. The user defines the domain the map will be published on, name and language for the map. The user can set the size of the published map, a selection of tools that will be overlayed on the map and affect the maplayers that are initially visible when the map is shown. The main map is modified to show a preview of the published map when the publisher is opened and it resumes to normal view once the publisher flyout is closed. The publisher can promote map layers to the user, but at the moment the configuration which layers are promoted and the promotion text is not passed from the server (defined in code so promotion could be easily configured but it isn't for now).

### TODO

- promoted map layers configuration

### Screenshot

#### Start publishing 
[[Image(start_map_publish.png)]]

#### Map publishing
[[Image(publish_map.png)]]

### Bundle configuration

No configuration is required.

### Bundle state

No statehandling has been implemented.

### Requests the bundle handles

This bundle doesn't handle any requests.

### Requests the bundle sends out 

|| Request || Where/why it's used ||
|| userinterface.AddExtensionRequest || Register as part of the UI in start()-method ||
|| userinterface.RemoveExtensionRequest || Unregister from the UI in stop()-method ||
|| AddMapLayerRequest || If any layer is marked for promotion, the user can add it from the publisher. When the publisher is closed, adds any layers that were removed because user didn't have publish rights. ||
|| RemoveMapLayerRequest || If promoted layer is added via publisher, it can be removed as well. Also removes layers from selection that the user can't publish ||
|| userinterface.UpdateExtensionRequest || Requests close on the flyout when publisher is closed and close to any other flyout when the publisher is opened. ||


### Events the bundle listens to 

|| Event || How does the bundle react ||
|| AfterMapLayerAddEvent || Updates the flyout to reflect current maplayer selections ||
|| AfterMapLayerRemoveEvent || Updates the flyout to reflect current maplayer selections ||
|| MapLayerEvent || Updates the flyout to reflect current maplayer selections ||
|| AfterMapMoveEvent || Updates coordinate information in publisher if applicable ||
|| userinterface.ExtensionUpdatedEvent || Determines if the layer was closed or opened and enables/disables preview view accordingly ||
|| Publisher.MapPublishedEvent || Publisher views send this event so personaldata can refresh its listing. Publisher instance also listens the event to show user HTML code for embedding the map to a page. ||

### Events the bundle sends out

|| Event || When it is triggered/what it tells other components ||
|| Publisher.MapPublishedEvent || Sends when the server returns a valid response that the map has been published. ||

### Dependencies (e.g. jquery plugins) 

|| Dependency || Linked from || API || Purpose ||
|| jQuery || Linked in portal theme || [http://api.jquery.com/] || Used to create the component UI from begin to end ||
|| Backend documentation || N/A || [wiki:DocumentationBundleMapPublisherBackend Backend API] || Publisher backend functionality ||
|| Oskari DivManager || Expects to be present in application setup ||  [wiki:DocumentationBundleDivManazer DivManazerBundle] || Needed for flyout/tile functionality and accordion/form components ||
