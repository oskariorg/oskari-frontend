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
         - git clone ssh://git@haisulike01.nls.fi/oskari-server
       * Create jetty configuration file
         - cd [..]work/oskari-server/servlet-map/src/main/webapp/WEB-INF
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
       * cd [..]work/oskari-server/external-libs
           * run all commands in mvn-install.txt
           * cd ..
       * mvn -f servlet-map-pom.xml install
       [Build actions:]
       - creates Oskaridb HSQL database, if not created
       - inserts minimal data to the database tables for to use Oskari
       - starts Jetty and servlet
       - webapp directory = [..]/work/oskari-server/servlet-map/src/main/webapp

       * Start Oskari  ( http://localhost:2373 )

### 4. Properties
       File [..]work/oskari-server/servlet-map/src/main/resources/fi/nls/oskari/map/servlet/oskari.properties:
       - setup of various url links for search service, GIS metadata, GeoServer myplaces, print service, etc

## C. Authorization

### 1. Add new users and roles
   
       * edit user.json and roles.json files in resource path [..]work/oskari-server/servlet-map/src/main/resources/fi/nls/oskari/user/user.json
       * role data for user must be in portti_permission and portti_recource_user tables (see next subsection)
       
       sample user.json:
       
        {
            "users": [
                {
                    "firstName": "Antti",
                    "id": 2,
                    "lastName": "Aalto",
                    "pass": "oskari",
                    "roles": [
                        3,
                        4
                    ],
                    "user": "admin"
                },
                {
                    "firstName": "Oskari",
                    "id": 3,
                    "lastName": "Olematon",
                    "pass": "user",
                    "roles": [
                        3
                    ],
                    "user": "user"
                }
            ]
        }

        sample role.json:
        
        {
          "roles": [
            {
                "id": 3,
                "name": "Karttakäyttäjä"
            },
            {
                "id": 4,
                "name": "Admin"
            }
          ]
        }



### 2. Add new user roles and permissions
       * edit script file  [..]work/oskari-server/servlet-map/src/main/resources/fi/nls/oskari/map/servlet/db/exampleLayersAndRoles.sql       
        - add row to portti_resource_user table, e.g. INSERT INTO portti_resource_user (resource_name, resource_namespace, resource_type, externalid, externalid_type) values ('Osoitekartta', 'http://wms.w.paikkatietoikkuna.fi/wms/kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?', 'WMS_LAYER', 10114, 'ROLE');
        - add row to portti_permissions table, e.g. INSERT INTO portti_permissions (resource_user_id, permissions_type) values (10, 'PUBLISH');

       * execute F. Tips and Tricks 1

## D. Map layers

### 1. Add new layer
       * edit script file [..]work/oskari-server/servlet-map/src/main/resources/fi/nls/oskari/map/servlet/db/exampleLayersAndRoles.sql
       - add row to portti_layerclass table, e.g. INSERT INTO portti_layerclass (namefi, namesv, nameen, maplayers_selectable, group_map, locale, parent) values ('Geologian tutkimuskeskus','Geologiska forskningscentralen','Geological Survey of Finland',true,false,'{ fi:{name:"Geologian tutkimuskeskus"},sv:{name:"Geologiska forskningscentralen"},en:{name:"Geological Survey of Finland"}}',null);
       - add row to portti_maplayer table, e.g. INSERT INTO portti_maplayer (layerclassid, namefi, namesv, nameen, wmsname, wmsurl, opacity, style, minscale, maxscale, description_link, legend_image, inspire_theme_id, dataurl, metadataurl, order_number, layer_type, locale) VALUES (3,'Maaperäkartta 1:20 000 / 1:50 000','Jordartskarta 1:20 000 / 1:50 000','Superficial deposits map 1:20 000 / 1:50 000','3','http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer',75,'',100000,10000,'http://www.paikkatietoikkuna.fi/web/guest/maaperakartta-1/20000', 'http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta20k.png',11,'0f3f054f-ad70-4cf1-a1d1-93589261bd04','',2,'wmslayer', '{ fi:{name:"Maaperäkartta 1:20 000 / 1:50 000",subtitle:""},sv:{name:"Jordartskarta 1:20 000 / 1:50 000",subtitle:""},en:{name:"Superficial deposits map 1:20 000 / 1:50 000",subtitle:""}}');

       * execute F. Tips and Tricks 1

## E. Database

The SQL scripts that generate the HSQL database are located in the directory [..]work/servlet-map/src/main/resources/fi/nls/oskari/map/servlet/db/. The actual database files will be generated into the directory [..]work/oskari-server/data. The database structure is documented in detail in the md file [..]work/Oskari/docs/md/architecture/database.md.

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


## F. Tips and Tricks

       1. Recreate database --> delete files under [..]work/oskari-server/data and rebuild all:
          - mvn -f servlet-map-pom.xml clean install

       2. Start Oskari without rebuilding
          --> start Jetty:
              - cd [..]work/oskari-server/servlet-map
              - mvn jetty:run
          --> start Oskari: http://localhost:2373
