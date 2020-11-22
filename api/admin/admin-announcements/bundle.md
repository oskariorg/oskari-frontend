# admin-announcements

Admin bundle for making announcements.

## Description

The bundle allows admins to create announcements to be displayed in announcements tab. Admins can optionally also set the announcement to be displayed in a pop-up. 

## Announcement parameters

These are the parameters you can set for an announcement when creating a new announcement or editing an old one.

<table class="table">
  <tr>
    <th> Parameter </th><th> Functionality</th>
  </tr>
  <tr>
    <td>Title</td><td>Title of the announcement. (String)</td>
  </tr>
  <tr>
    <td>Content</td><td>The body of the announcement. (String)</td>
  </tr>
  <tr>
    <td>Starting date</td><td>Starting date of the announcement. Announcement won't be displayed until its starting date. This is displayed as "Valid" date selector. (Date)</td>
  </tr>
  <tr>
    <td>End date</td><td>Ending date of the announcement. Announcement won't be displayed after its ending date. This is displayed as "Valid" date selector. (Date)</td>
  </tr>
  <tr>
    <td>Active</td><td>If toggled on, the announcement will show as a pop-up when users enter the application. The pop-up can be toggled off by the users after they have seen it. (Boolean)</td>
  </tr>
</table>

## TODO

* Make Admin-announcements bundle to be a separate tab on the same tile OR make the functionality be similar to admin-layereditor.
* Finish DeleteButton.js
* Tests

## Bundle configuration

Frontend has no configuration, but the bundle is usually configured to be shown only to admin users. Configuration is done in oskari-server using oskari-ext.properties.

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [Oskari announcements](/documentation/bundles/framework/announcements) </td>
    <td> Expects to be present in application setup </td>
    <td> Oskari's announcements bundle. Uses announcements bundle's services</td>
  </tr>
  </tr>
</table>
