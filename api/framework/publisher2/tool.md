# Tool

## Description
Tools are used to modify published map view's app setup configuration.
The Tool component describes how to implement new tools to the publisher.

## How to use
Each Tool has to implement protocol ```Oskari.mapframework.publisher.Tool``` to be included in the publisher.
To implement the protocol Tool has to implement following functions.

### ```init```
Receives object describing the app configuration as a parameter.
Init should read the pdata to see if the tool should be enabled or not.
Then set the initial state for the tool using setEnabled function.

### ```setEnabled```
Defines what happens when user selects/unselects the tool.

### ```getValues```
Returns the part of app setup configuration the tool alters.
Example:
```
var enabled = this.state.enabled;
return {
    configuration: {
        statsgrid: {
            conf: {
                allowClassification: enabled,
                legendLocation: 'bottom right'
            }
        }
    }
}
```


