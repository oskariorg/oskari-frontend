# Bundle name

<table>
  <tr>
    <td>ID</td><td>bundle identifier</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>link/here)</td>
  </tr>
</table>

## Description

''The user can view/edit MyPlaces, My Views, Embedded maps and own account .''

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
  test : 2
}
```

OR

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
<tr>
  <th> Request </th><th> Where/why it's used</th>
</tr>
<tr>
  <td> publisher.PublishMapEditorRequest </td><td> Register as part of the UI in start()-method</td>
</tr>
</table>

## Events the bundle listens to

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
