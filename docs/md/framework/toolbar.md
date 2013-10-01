# Toolbar

<table>
  <tr>
    <td>ID</td><td>toolbar</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance.html)</td>
  </tr>
</table>

## Description

The toolbar bundle provides a common interface for other bundles to add and manipulate tool buttons to a common toolbar. Bundles can add, remove, disable and enable buttons in the toolbar. The toolbar is rendered to a HTML element with id "toolbar". The bundle doesn't create it but assumes it exists on the page.

## TODO

* Currently toolbar has a set of default buttons. These should propably be added by other bundles.
* Handling missing for disabling an active tool (selected tool is disabled through request)

## Screenshot

![screenshot](<%= docsurl %>images/toolbar.png)

## Bundle configuration

No configuration is required, but toolgroups and tools can be excluded from being added by default.

In the example below, all tools are excluded from the toolbar.

```javascript
"conf": {
  "history": {
    "reset": false,
    "history_back": false,
    "history_forward": false
  },
  "basictools": {
    "zoombox": false,
    "select": false,
    "measureline": false,
    "measurearea": false
  },
  "viewtools": {
    "link": false,
    "print": false
  }
}
```

The following example also excludes all the tools from the toolbar, by setting all groups to false.

```javascript
"conf": {
  "history": false,
  "basictools": false,
  "viewtools": false
}
```

A tool button can be configured to be disabled by adding following to the configuration:

```javascript
"conf": {
  "disabled": true
}
```

## Bundle state

```javascript
state : {
  selected : {
    id : '<id for the selected button>',
    group: '<group for the selected button>'
  }
}
```

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td> Toolbar.AddToolButtonRequest </td><td> tbd</td>
  </tr>
  <tr>
    <td> Toolbar.RemoveToolButtonRequest </td><td> tbd</td>
  </tr>
  <tr>
    <td> Toolbar.ToolButtonStateRequest </td><td> tbd</td>
  </tr>
  <tr>
    <td> Toolbar.SelectToolButtonRequest </td><td> tbd</td>
  </tr>
</table>

## Requests the bundle sends out

Currently default buttons send out requests but these should be defined in bundles that use toolbar.

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td> ToolSelectionRequest </td><td> tbd</td>
  </tr>
  <tr>
    <td> StateHandler.SetStateRequest </td><td> tbd</td>
  </tr>
  <tr>
    <td> ClearHistoryRequest </td><td> tbd</td>
  </tr>
</table>

This bundle doesn't send out any requests.

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> Toolbar.ToolSelectedEvent </td><td> Notifies that a tool has been selected. If bundle has own toolbar buttons, they should listen to this and act if the functionality has been canceled and clean up anything they might have on screen regarding that tool. The event specifies the new tool id/group which has been selected.</td>
  </tr>
</table>

## Dependencies

Depends on an element with id "toolbar" to be present on DOM.
Print and link buttons require mapfull bundle, Oskari.userinterface.component.Popup and Oskari.userinterface.component.Button from divmanazer bundle.

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create tool buttons/HTML</td>
  </tr>
</table>
