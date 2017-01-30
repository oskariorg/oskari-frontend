# UIChangeEvent

 Used to notify about major UI changes where some functionalities should clean up/shutdown their own UI.
 An example would be that publisher is opened and expects to have the whole UI for itself and sends an UIChangeEvent. Other bundles like statsgrid should react to the event by cleaning up the UI that it has reserved.

# Event methods

## getName

Get event name.

## getFunctionality

Returns functionality id which triggered the change