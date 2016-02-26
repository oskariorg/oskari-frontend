# admin-users

User administration UI

## Description

User account admin interface for creating, deleting and modifying users.

## TODO

* ''Some sort of pagination''

## Bundle configuration

```javascript
{
    "restUrl" : "[(relative url for rest operations)]"
}
```

* restUrl is the URL for all the REST operations. It is added to the base ajax URL.
* operations are semi-REST at the moment; we use PUT, DELETE, etc., but use a parameter for UID instead of a path-like solution

## Events the bundle listens to

<table class="table">
<tr>
  <th> Event </th><th> How does the bundle react</th>
</tr>
<tr>
  <td> userinterface.ExtensionUpdatedEvent </td><td> Loads users when the flyout is opened</td>
</tr>
</table>