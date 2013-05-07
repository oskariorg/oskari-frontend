# Standalone Oskari backend/frontend

## A. Overview

    This package serves a standalone platform for to use and apply Oskari frontend/backend software.
    Standalone package uses HSQL database for backend application data and Jetty servlet for web services.
    
    Remark: WFS-layers are not yet supported in this package
    

## B. Quick Start

### 1. Before installation

1. Install Cygwin (windows)
2. Install git
3. Install Jetty
    - create jetty-env.xml (location doesn't matter)
	
        <pre>
        <Configure class="org.mortbay.jetty.webapp.WebAppContext">
            ...
            <New id="oskaridb2" class="org.mortbay.jetty.plus.naming.Resource">
                <Arg>jdbc/OskariPool</Arg>
                <Arg>
                    <New class="org.apache.commons.dbcp.BasicDataSource">
                        <Set name="driverClassName">org.hsqldb.jdbcDriver</Set>
                        <Set name="url">jdbc:hsqldb:file:data/oskaridb</Set>
                    </New>
                </Arg>
            </New>
            ...
        </Configure>
        </pre>
4. Install Maven
	- set up reference to jetty-env.xml in maven's settings, e.g.
	
        <pre>
        ...
        <pluginGroups>
            <pluginGroup>org.mortbay.jetty</pluginGroup>
        </pluginGroups>
        ...
        <profiles>
            <profile>
                <properties>
                    <jetty.env.conf>C:\jetty-env.xml</jetty.env.conf>
                    ...
        </pre>

### 2. Oskari installation
       * Install Oskari frontend 
         - (cd ..work/ - git clone ssh://git@haisulike01.nls.fi/Oskari)
       * Install Oskari backend
         - (cd ..work/ -  git clone ssh://git@haisulike01.nls.fi/oskari-backend)
         
       Installed items:
       ================
       - Oskari frontend
       - servlet software
       - database init software
       - Oskari backend libraries
       - Jetty
       - HSQL 
       - etc
        
### 3. Start  (build all)
       * cd .. work/oskari-backend/external-libs
	   * run all commands in mvn-install.txt
	   * cs ..
       * mvn -f servlet-map-pom.xml install
       Build actions:
       ==============
       - creates Oskaridb HSQL database, if not created
       - inserts minimal data to the database tables for to use Oskari
       - starts Jetty and servlet
       - Webapp directory = ..\work\oskari-backend\servlet-map\src\main\webapp
       - jetty-env.xml = whatever it's set to in maven
       
       
       * Start Oskari  ( http://localhost:2373 )
       
### 4. Properties
       oskari.properties file:
       =======================
       - setup of various url links for search service, GIS metadata, GeoServer myplaces, print service, etc

## C. Authorization

### 1. User roles

### 2. Add new user

## Map layers

### 1. Add new layer



## D. Database

### 1. Bundle tables
       * portti_bundle  (definition of all available  bundles)
       * portti_view_bundle_seq (bundle <--> view relations, plugin configs, state configs)
       
### 2. View tables
       * portti_view  (definition of all available views)
       * portti_view_supplement (extra data for view)
       
### 3. Authorization tables
       User authorizing is fixed in this version in the source code (MapFullServlet.java))
       - Roles: GUEST_ROLE = 10110, MAP_ROLE = 2, ADMIN_ROLE = 3
       - User: "user" -> MAP_ROLE, "admin" -> MAP_ROLE+ADMIN_ROLE, else GUEST_ROLE
   
       * portti_permissions  (user permissions for layers:'VIEW_LAYER','PUBLISH', 'VIEW_PUBLISHED' )
       * portti_resource_user (the resources (layers), which the user can access )
       
### 4. Map layer tables
       * portti_maplayer  (maplayer data: names, wms url, zoom min-max, opacity, layertype, etc )
       * portti_maplayer_metadata (inspire metadata uuids for linking metadata to map layer)
       * portti_inspiretheme  (inspire themes for grouping map layers)
       * portti_layerclass (map service owners for grouping map layers )
       * portti_capabilities_cache (prefetched wms capabilities requests )
       
 ## E. Tips and Tricks
 
       1. Recreate database --> delete files under /oskari-backend/data  and rebuild all ( mvn -f servlet-map-pom.xml clean install)
       
       2. Start Oskari without rebuilding  
          --> start Jetty: cd ..\work\oskari-backend\servlet-map
          saaa--> start Oskari: http://localhost:2373