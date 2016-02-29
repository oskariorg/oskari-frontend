# promote

Used as a placeholder for functionalities that require login.

## Description

This Bundle provides functionality to promote sign-in and registration. Bundles that require signed in users benefit from using the promote bundle by the smaller size.

## Bundle configuration

The mininal configuration is __name, title, and desc. The __name value is used to uniquely identify the bundle and the recommendation is to name after the bundle Promote is replacing. The title and desc values should also be identical with the replaced bundle.

```javascript
conf = {
    "__name": "BundleNameToReplace",
    "title": {
        "fi": "Otsikko tileen",
        "en": "Title for Tile"
    },
    "desc": {
        "fi": "Voit käyttää toimintoa kirjauduttuasi palveluun.",
        "en": "You need to log in before using this functionality."
    }
};
```

Optional configurations are signup, signupUrl, register, registerUrl, and toolbarButtons.
All added buttons are disabled.

```javascript
conf = {
    "__name": "BundleNameToReplace",
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

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](/documentation/bundles/framework/divmanazer) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for flyout/tile functionality and accordion/form components</td>
  </tr>
  <tr>
    <td> [Oskari toolbar](/documentation/bundles/framework/divmanazer/toolbar) </td>
    <td> Expects to be present in application setup when configured to add buttons</td>
    <td> Needed for adding configured buttons</td>
  </tr>
</table>
