# User Guide

<table class="table">
  <tr>
    <td>ID</td><td>userguide</td>
  </tr>
  <tr>
    <td>API</td><td>[link](/api/latest/classes/Oskari.mapframework.bundle.userguide.UserGuideBundleInstance.html)</td>
  </tr>
</table>

## Description

Creates the Userguide flyout with title and content. 

## Bundle configuration

Bundle needs title(s) and data as configuration. There are two options to make the configuration:

1) If you have only one document to show and you don't need any tabs, you can make the configuration to the locale. 

```javascript
{
  "help": {
      tags: "tag1, tag2",
      contentPart: "body"
  }
};
```
The bundle will create basic flyout with content defined by tags.

2) If you wish to have tabs, they should be found in configuration as follows:

```javascript
{
  "tabs": [
      {title: "title1", tags: "tag1"},
      {title: "title2", tags: "tag2"},
      {title: "title3", tags: "tag3"},
      {title: "title4", tags: "tag4"}
  ]
};
```
The bundle creates as many tabs as there are them in configuration. If there is no configuration, the bundle gets tags from locale.

Method getHelpArticle fetches an article from the server using getAjaxUrl method. 

```javascript
jQuery.ajax({
        url: me.sandbox.getAjaxUrl() + 'action_route=GetArticlesByTag',
        data: {
            tags: taglist
        },
        type: 'GET',
        dataType: 'json'
});
```
Example of Request URL:

`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetArticlesByTag&tags=tag1%2Ctag2`


## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>userguide.ShowUserGuideRequest</td><td>Shows userguide</td>
  </tr>
</table>

## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>userinterface.RemoveExtensionRequest</td><td>When the bundle is stopped, defaultExtension is removed</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>userinterface.ExtensionUpdatedEvent</td><td>Handles the updated event</td>
  </tr>
</table>

## Events the bundle sends out

This bundle doesn't send out any events.
