# LaKaPa Help

<table class="table">
  <tr>
    <td>ID</td><td>LakapaHelpBundle</td>
  </tr>
</table>

## Description

This bundle provides a help tool. User can see help.

## Screenshot

![screenshot](lakapahelp.png)


## Bundle configuration

Need step(s) configurations.

```javascript
"steps": {
      "fi": [],
      "en": [],
      "sv": []
}
```

Localizated steps contains one or more JSON objects what defined step.
```javascript
{
  "title": "Step title",
  "visible": [],
  "html": "The step HTML",
  "menulink": "Menu linked Jquery element"
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th>Where/why it's used</th>
  </tr>
  <tr>
    <td>`ChangeLanguageRequest`</td><td>Changes help language</td>
  </tr>
  <tr>
    <td>`ShowHelpRequest`</td><td>Shows help</td>
  </tr>
  <tr>
    <td>`TransportChangedRequest`</td><td>Refresh help to show selected transport steps</td>
  </tr>
</table>

## Requests the bundle sends out


<table class="table">
  <tr>
    <th>Request</th><th>Where/why it's used</th>
  </tr>
    <td>`userinterface.AddExtensionRequest`</td><td>Register as part of the UI in start()-method.</td>
  </tr>
  <tr>
    <td>`userinterface.RemoveExtensionRequest`</td><td>Unregister from the UI in stop()-method.</td>
  </tr>
</table>


## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`userinterface.ExtensionUpdatedEvent`</td>
    <td>Listens to `lakapa-help` Flyout opens/closes</td>
  </tr>
</table>

## Events the bundle sends out

This bundle doesn't send any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[jQuery](http://api.jquery.com/)</td>
    <td>Assumes to be linked in the page</td>
    <td>Used to create the component UI from begin to end</td>
  </tr>
</table>
