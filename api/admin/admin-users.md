# Admin Users

<table class="table">
  <tr>
    <td>ID</td><td>admin-users</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](/api/latest/classes/Oskari.mapframework.bundle.admin-users.AdminUsersBundleInstance.html)</td>
  </tr>
</table>

## Description

User account administer interface.
Creating, deleting and modify users.

## TODO

* ''E-mail field?''
* ''Some sort of pagination''

## Bundle configuration

```javascript
{
    "restUrl" : "[(relative url for rest operations)]"
}
```

* restUrl is the URL for all the REST operations. It is added to the base ajax URL.
* operations are semi-REST at the moment; we use PUT, DELETE, etc., but use a parameter for UID instead of a path-like solution

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

<table class="table">
<tr>
  <th> Event </th><th> How does the bundle react</th>
</tr>
<tr>
  <td> userinterface.ExtensionUpdatedEvent </td><td> Loads users</td>
</tr>
</table>

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

This bundle doesn't have any dependencies.