# Oskari user permissions and access rights management

## Oskari access rights ER model


![Contents of map_layers table](<%= docsurl %>images/map_layers_table.png)

![Contents of permissions table](<%= docsurl %>images/permissions.png)

 

### WMS layer

*portti_resource_user*

* resource\_name = wmsname (from portti\_maplayer table)
* resource\_namespace = wmsurl (from portti\_maplayer table)
* reource\_type = "WMS_LAYER"
* externalid = role id (role's id on user's role list)
* external\_type = "ROLE"

*portti_permissions*

permissions\_type = "VIEW\_LAYER" or "PUBLISH" for example

### Background map layer:

*portti_resource_user*

* resource\_name = id from portti\_layerclass  table
* resource\_namespace = empty
* reource\_type = "WMS\_LAYER\_GROUP"
* externalid = role's id (role's id on user's role list)
* external\_type = "ROLE"

*portti_permissions*

permissions\_type =  "VIEW\_LAYER" or "PUBLISH" for example


![User table](<%= docsurl %>images/userUML.png)
![Role table](<%= docsurl %>images/roleUML.png)

## Oskari Ajax Sequence Diagram

Below is the Oskari Ajax request sequence diagram. In the diagram UserDB returns data needed by User class (including user roles).

![Ajax sequence diagram](<%= docsurl %>images/OskariAjaxSequenceDiagram.png)

## Servlet Context Initialization

1. Initializing PropertyUtilsit
2. Adding default handlers
3. Adding custom handlers

![Servlet context init](<%= docsurl %>images/ServletContextInit.png)

    Servlet->Servlet: PropertyUtil
    Servlet->ActionControl: addDefaultControls
    note right of Servlet: Registers ActionHandlers
    Servlet->ActionControl: addAction
    note right of Servlet: Register CustomHandlers


## Options for user management implementation

 * http://shiro.apache.org/
 * openLdap
 * ubisecure