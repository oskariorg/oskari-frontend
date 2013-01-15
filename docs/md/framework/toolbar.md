# Toolbar

|| Bundle-Identifier || toolbar ||
|| API || [//docs/oskari/api/#!/api/Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance link] ||

## Description

The toolbar bundle provides a common interface for other bundles to add and manipulate tool buttons to a common toolbar. Bundles can add, remove, disable and enable buttons in the toolbar. The toolbar is rendered to a HTML element with id "toolbar". The bundle doesn't create it but assumes it exists on the page.

## TODO

* Currently toolbar has a set of default buttons. These should propably be added by other bundles.
* Handling missing for disabling an active tool (selected tool is disabled through request)

## Screenshot

[[Image(toolbar.png)]]

## Bundle configuration

No configuration is required.

## Bundle state

{{{
state : {
    selected : {
        id : '<id for the selected button>',
        group: '<group for the selected button>'
    }
}
}}}

## Requests the bundle handles

|| '''Request''' || '''How does the bundle react''' ||
|| Toolbar.AddToolButtonRequest || tbd ||
|| Toolbar.RemoveToolButtonRequest || tbd ||
|| Toolbar.ToolButtonStateRequest || tbd ||
|| Toolbar.SelectToolButtonRequest || tbd ||


## Requests the bundle sends out

Currently default buttons send out requests but these should be defined in bundles that use toolbar. 

|| '''Request''' || '''Why/when''' ||
|| ToolSelectionRequest || tbd ||
|| StateHandler.SetStateRequest || tbd ||
|| ClearHistoryRequest || tbd ||

This bundle doesn't send out any requests.

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

|| '''Event''' || '''Why/when''' ||
|| Toolbar.ToolSelectedEvent || Notifies that a tool has been selected. If bundle has own toolbar buttons, they should listen to this and act if the functionality has been canceled and clean up anything they might have on screen regarding that tool. The event specifies the new tool id/group which has been selected. ||

## Dependencies (e.g. jquery plugins)

Depends on an element with id "toolbar" to be present on DOM.
Print and link buttons require mapfull bundle, Oskari.userinterface.component.Popup and Oskari.userinterface.component.Button from divmanazer bundle.

|| '''Dependency''' || '''Linked from''' || '''API''' || '''Purpose''' ||
|| jQuery || Version 1.7.1 assumed to be linked (on page locally in portal) || http://api.jquery.com/ || Used to create tool buttons/HTML ||
