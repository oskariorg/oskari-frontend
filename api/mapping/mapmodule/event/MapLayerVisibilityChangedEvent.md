# MapLayerVisibilityChangedEvent

This is used to notify that layers visibility has changed. Either the map has
moved out of the layers scale range or the layers geometry is no longer in the maps viewport.
Listeners should also check getMapLayer().getVisible() method that indicates if the map has been hidden by the user.
