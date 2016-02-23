# Form & FormInput

## Description

A Form is a passive container for zero or more FormInputs. It can trigger validation of all contained FormInputs and display and clear any errors
reported by the FI's.

A FormInput is a smart wrapper for an input, capable of, for example, validating values with regexp, reporting errors and triggering functions on
events like keypresses and focus changes.

## Screenshot

![screenshot](form.png)

## Usage

### Simple one-field form

```javascript
var form = Oskari.clazz.create('Oskari.userinterface.component.Form');
var anInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', 'input');

anInput.setPlaceholder('Placeholder text');
anInput.setRequired(true, 'Required field');
anInput.setContentCheck(true, 'Input contains illegal characters');
anInput.bindEnterKey(someInputHandler);
form.addField(anInput);
someElement.append(form.getForm());
```

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked on the page</td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
</table>
