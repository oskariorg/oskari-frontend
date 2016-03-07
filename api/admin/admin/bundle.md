# admin

Generic admin ui which other admin bundles can hook to.

## Description

Bundle manages administrative functionalities that can have minimal UI requirements. Currently only default view management is implemented.

### Default Views

Lists Oskari views that are configured as default views. This includes a global default and any possible role-based default views.
The listing includes functionality to set the current map location and layers to given default view. It also warns if any of the layers are
not accessible by guest users.

## Bundle configuration

No configuration is required.

## Bundle state

No state is required.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked on the page</td>
    <td> Used to create the UI</td>
  </tr>
  <tr>
    <td> [Lo-Dash](http://lodash.com/) </td>
    <td> Assumed to be linked on the page</td>
    <td> Mainly for _.template() and _.each()</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](/documentation/bundles/framework/divmanazer)</td>
    <td> Expects to be present in the application setup </td>
    <td> For Tile/Flyout and other UI components</td>
  </tr>
</table>
