/**
 * @class Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.SelectedDrawingEvent
 * Used for example to notify components to reset any saved "selected place" data.
 */
Oskari.clazz.define(
        'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.SelectedDrawingEvent',
        function(pPlace, dblClick, creatorId) {
            this._creator = null;
            this._place = pPlace;
            this._dblClick = dblClick;
            this._creatorId = creatorId;
        }, {
            __name : "DrawPlugin.SelectedDrawingEvent",
            getName : function() {
                return this.__name;
            },
            getPlace : function() {
                return this._place;
            },
            isDblClick : function() {
                return this._dblClick;
            },
            getCreatorId: function() {
                return this._creatorId;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */
