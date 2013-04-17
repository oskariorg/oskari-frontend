# Promote

<table>
  <tr>
    <td>ID</td><td>promote</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.promote.PromoteBundleInstance)</td>
  </tr>
</table>

## Description

This Bundle provides functionality to promote sign-in and registration. Bundles that require signed in users benefit from using the promote bundle by the smaller size.


## Bundle configuration

```javascript
conf = {
    "title": {
        "fi": "Otsikko tileen",
        "en": "Title for Tile"
    },
    "desc": {
        "fi": "Voit käyttää toimintoa kirjauduttuasi palveluun.",
        "en": "You need to log in before using this functionality."
    },
    "signup": {
        "fi": "Kirjaudu sisään",
        "en": "Log in"
    },
    "signupUrl": {
        "fi": "/web/fi/login",
        "en": "/web/en/login"
    },
    "register": {
        "fi": "Rekisteröidy",
        "en": "Register"
    },
    "registerUrl": {
        "fi": "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account",
        "en": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
    },
    "toolbarButtons": {
        "buttonGrp": {
            "buttonId": {
                "iconCls": "tool-reset",
                "tooltip": {
                    "fi": "Reset napin tooltip",
                    "en": "Reset button tooltip"
                }
            }
        }
    }
};
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table>
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](<%= docsurl %>framework/divmanazer.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for flyout/tile functionality and accordion/form components</td>
  </tr>
  <tr>
    <td> [Oskari toolbar](<%= docsurl %>framework/divmanazer/toolbar.html) </td>
    <td> Expects to be present in application setup when configured to add buttons</td>
    <td> Needed for adding configured buttons</td>
  </tr>
</table>
