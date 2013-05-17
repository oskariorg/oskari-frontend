# StatsGrid

<table>
  <tr>
    <td>ID</td><td>statsgrid</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>link/here)</td>
  </tr>
</table>

## Description

Bundle fetches data from the SotkaNET statistics and indicator bank (www.sotkanet.fi) and displays the data in a grid and visualizes it on the map. Users can classify the data in multiple ways.
The grid and the classifier are initialized as plugins.

## TODO

* ''List any planned features''

## Screenshot

![screenshot](<%= docsurl %>images/bundle_id.png)

## Bundle configuration

```javascript
config : {
  test : 1
}
```

OR

No configuration is required.

## Bundle state

```javascript
state : {
  layerId : "<id of the stats layer>",
  indicators : "<array of indicators>",
  currentColumn : "<selected indicator>",
  methodId : "<id of the selected classification method>",
  numberOfClasses : "<number of classification classes>",
  manualBreaksInput : "<input string for the manual breaks classification method>"
}
```

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>StatsGrid.StatsGridRequest</td><td>Enables/disables the statistics mode</td>
  </tr>
</table>

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>tbd</td><td>tbd</td>
  </tr>
</table>

OR

This bundle doesn't send out any requests.

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>tbd</td><td>tbd</td>
  </tr>
</table>

OR

This bundle doesn't listen to any events.

## Events the bundle sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>tbd</td><td>tbd</td>
  </tr>
</table>

OR

This bundle doesn't send out any events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[Library name](#link)</td><td>src where its linked from</td><td>*why/where we need this dependency*</td>
  </tr>
</table>

OR

This bundle doesn't have any dependencies.
