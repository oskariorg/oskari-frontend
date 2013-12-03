Oskari.clazz.define(
        'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.event.SelectedDrawingEvent',
        function(pPlace, dblClick) {
            this._creator = null;
            this._place = pPlace;
            this._dblClick = dblClick;
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
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */
