/**
 * @class Oskari.userinterface.event.ExtensionUpdatedEvent
 *
 * Sent after Extension view state has changed
 *
 */
Oskari.clazz
    .define('Oskari.userinterface.event.ExtensionUpdatedEvent', function (extension, viewstate, viewinfo) {
        "use strict";
        this._creator = null;
        this._extension = extension;
        this.viewstate = viewstate;
        this.viewinfo = viewinfo;
    }, {
        __name: "userinterface.ExtensionUpdatedEvent",
        getName: function () {
            "use strict";
            return this.__name;
        },

        /**
         * @method returns Extension
         */
        getExtension: function () {
            "use strict";
            return this._extension;
        },

        /**
         * @method getViewState
         * returns 'close','attach','detach','minimize','restore','minimize'
         */
        getViewState: function () {
            "use strict";
            return this.viewstate;
        },
        setViewState: function (viewstate) {
            "use strict";
            this.viewstate = viewstate;
        },

        /**
         * @method getViewInfo
         * returns a property with view dimension info (currently WHEN in restored or detached state)
         */
        getViewInfo: function () {
            "use strict";
            return this.viewinfo;
        },
        setViewInfo: function (viewinfo) {
            "use strict";
            this.viewinfo = viewinfo;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });

/* Inheritance */
