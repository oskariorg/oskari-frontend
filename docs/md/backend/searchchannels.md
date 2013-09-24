##Creating new location search channel services

There is an example search channel for OpenStreetMap available in the file `servlet-map/src/main/java/fi/nls/oskari/search/OpenStreetMapSearchService.java`. All search channel services need to implement the SearchableChannel interface from the file SearchableChannel.java in the same directory. To make the new channel available, the file `servlet-map/src/main/resources/fi/nls/oskari/map/servlet/oskari.properties` requires some modifications. First, some parameters of the new channel need to be defined. In the case of OpenStreetMapSearchService, those parameters are the Java class name and service URL:

    search.channel.OPENSTREETMAP_CHANNEL.className=fi.nls.oskari.search.OpenStreetMapSearchChannel
    search.channel.OPENSTREETMAP_CHANNEL.service.url=http://nominatim.openstreetmap.org/search

Second, the new channel needs to be included to the list of active search channels:

    search.channels=[...], OPENSTREETMAP_CHANNEL

Finally, it also needs to be included to the channels list of action handler's search results:

    actionhandler.GetSearchResult.channels=[...], OPENSTREETMAP_CHANNEL
