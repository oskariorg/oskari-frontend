##Creating new location search channel services

### OpenStreetMap search channel
There is an example search channel for OpenStreetMap available in the file `servlet-map/src/main/java/fi/nls/oskari/search/OpenStreetMapSearchService.java`. All search channel services need to implement the SearchableChannel interface from the file SearchableChannel.java in the same directory. To make the new channel available, the file `servlet-map/src/main/resources/fi/nls/oskari/map/servlet/oskari.properties` requires some modifications. First, some parameters of the new channel need to be defined. In the case of OpenStreetMapSearchService, those parameters are the Java class name and service URL:

    search.channel.OPENSTREETMAP_CHANNEL.className=fi.nls.oskari.search.OpenStreetMapSearchChannel
    search.channel.OPENSTREETMAP_CHANNEL.service.url=http://nominatim.openstreetmap.org/search

Second, the new channel needs to be included to the list of active search channels:

    search.channels=[...], OPENSTREETMAP_CHANNEL

Finally, it also needs to be included to the channels list of action handler's search results:

    actionhandler.GetSearchResult.channels=[...], OPENSTREETMAP_CHANNEL


###  ELF GeoLocator search channel

#### Supports

* **GetFeature** request  (exact location name search -  well 1st letter is forced to upper case )
* **FuzzyNameSearch** request (location name like search)

#### Source
* \oskari-server\service-search-nls\src\main\java\fi\nls\oskari\search\channel\ELFGeoLocatorSearchChannel.java

#### Setup in oskari-ext.properties  (portal-ext.properties) file


    #ELF GeoLocator channel settings
    search.channel.ELFGEOLOCATOR_CHANNEL.className=fi.nls.oskari.search.channel.ELFGeoLocatorSearchChannel
    search.channel.ELFGEOLOCATOR_CHANNEL.service.url=
    # Supported requests GetFeature and FuzzyNameSearch
    search.channel.ELFGEOLOCATOR_CHANNEL.service.request=FuzzyNameSearch

    Second, the new channel needs to be included to the list of active search channels:
    search.channels=[...], ELFGEOLOCATOR_CHANNEL
    search.channels.default=ELFGEOLOCATOR_CHANNEL

    #Finally, it also needs to be included to the channels list of action handler's search results:

    actionhandler.GetSearchResult.channels=[...], ELFGEOLOCATOR_CHANNEL



