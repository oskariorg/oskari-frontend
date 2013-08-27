# Standalone Oskari backend/frontend

## A. Overview

    This package serves a standalone platform for to use and apply Oskari frontend/backend software.
    Standalone package uses HSQL database for backend application data and Jetty servlet for web services.

    Remark: WFS-layers are not yet supported in this package

## B. Quick Start

### 1. Before installation

1. Install Cygwin (Windows)
2. Install git
3. Install Maven

### 2. Oskari installation
       * Install Oskari frontend
         - cd [..]work/
         - git clone ssh://git@haisulike01.nls.fi/Oskari
       * Install Oskari backend
         - cd [..]work/ 
         - git clone ssh://git@haisulike01.nls.fi/oskari-backend
       * Create jetty configuration file
         - cd [..]work/oskari-backend/servlet-map/src/main/webapp/WEB-INF
         - cp jetty-env.sample.xml jetty-env.xml

       [Installed items:]
       - Oskari frontend
       - servlet software
       - database init software
       - Oskari backend libraries
       - Jetty
       - HSQL
       - etc

### 3. Start  (build all)
       * cd [..]work/oskari-backend/external-libs
           * run all commands in mvn-install.txt
           * cd ..
       * mvn -f servlet-map-pom.xml install
       [Build actions:]
       - creates Oskaridb HSQL database, if not created
       - inserts minimal data to the database tables for to use Oskari
       - starts Jetty and servlet
       - Webapp directory = ..\work\oskari-backend\servlet-map\src\main\webapp

       * Start Oskari  ( http://localhost:2373 )

### 4. Properties
       [oskari.properties file:]
       - setup of various url links for search service, GIS metadata, GeoServer myplaces, print service, etc

## C. Authorization

### 1. Add new users
       * Edit MapFullServlet.java

### 2. Add new user roles and permissions
       (edit script file ..work\oskari-backend\servlet-map\src\main\resources\fi\nls\oskari\map\servlet\db\exampleLayersAndRoles.sql)
       * add row to portti_resource_user table
       (e.g. add "Osoitekartta";"http://wms.w.paikkatietoikkuna.fi/wms/kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?";"WMS_LAYER";"10114";"ROLE" )
       * add row to portti_permissions table
       (e.q. add "5";"PUBLISH")

       * execute tips&tricks 1

## D. Map layers

### 1. Add new layer
       (edit script file ..work\oskari-backend\servlet-map\src\main\resources\fi\nls\oskari\map\servlet\db\exampleLayersAndRoles.sql)
       * Add row to portti_layerclass table
       "Geologian tutkimuskeskus";"Geologiska forskningscentralen";"Geological Survey of Finland";TRUE;;"";"";FALSE;"{ fi:{name:"Geologian tutkimuskeskus"},sv:{name:"Geologiska forskningscentralen"},en:{name:"Geological Survey of Finland"}}"
       * Add row to portti_maplayer table
       e.g.
       3;"Maaperäkartta 1:20 000 / 1:50 000";"Jordartskarta 1:20 000 / 1:50 000";"Superficial deposits map 1:20 000 / 1:50 000";"3";"http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer";75;"''";100000;10000;"http://www.paikkatietoikkuna.fi/web/guest/maaperakartta-1/20000";"http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta20k.png";11;"0f3f054f-ad70-4cf1-a1d1-93589261bd04";"''";2;"wmslayer";"";"";"";"";"";"";"";"";"";;"";"";"''";"''";"''";"";"1.3.0";3067;"{ fi:{name:"Maaperäkartta 1:20 000 / 1:50 000",subtitle:""},sv:{name:"Jordartskarta 1:20 000 / 1:50 000",subtitle:""},en:{name:"Superficial deposits map 1:20 000 / 1:50 000",subtitle:""}}"
       
       * execute tips&tricks 1

## E. Database

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
          --> start Jetty: cd ..\work\oskari-backend\servlet-map  / mvn jetty:run
          --> start Oskari: http://localhost:2373

