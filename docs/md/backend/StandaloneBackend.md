# Standalone Oskari backend/frontend

## A. Overview

    This package serves a standalone platform for to use and apply Oskari frontend/backend software.
    Standalone package uses HSQL databse for backend application data and Jetty servlet for web services.
    

## B. Quick Start

### 1. Before installation

1. Install Cygwin
2. Install Maven
3. Install Oskari frontend

### 2. Installation
       * Go to path (e.g. ../oskari-backend )
       * git clone ...
       Installed items:
       ================
       - servlet software
       - database init software
       - Jetty
       - HSQL 
       - etc
        
### 3. Start  (build all)
       * mvn -f servlet-map-pom.xml install
       Build actions:
       ==============
       - creates Oskaridb HSQL database, if not created
       - inserts minimal data to the database tables for to use Oskari
       - starts Jetty and servlet
       
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
       * portti_permissions  (?)
       * portti_resource_user (?)
       
### 4. Map layer tables
       * portti_maplayer  (maplayer data: names, wms url, zoom min-max, opacity, layertype, etc )
       * portti_maplayer_metadata (?)
       * portti_inspiretheme  (inspire themes for grouping map layers)
       * portti_layerclass (map service owners for grouping map layers )
       * portti_capabilities_cache (?)
       
 