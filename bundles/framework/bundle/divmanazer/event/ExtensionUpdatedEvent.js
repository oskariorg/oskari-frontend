/**
 * @class Oskari.userinterface.event.ExtensionUpdatedEvent
 *
 * Sent after Extension view state has changed
 *
 */
Oskari.clazz
    .define('Oskari.userinterface.event.ExtensionUpdatedEvent', function (extension, viewstate, viewinfo) {
        this._creator = null;
        this._extension = extension;
        this.viewstate = viewstate;
        this.viewinfo = viewinfo;
    }, {
        __name: "userinterface.ExtensionUpdatedEvent",
        getName: function () {
            return this.__name;
        },

        /**
         * @method returns Extension
         */
        getExtension: function () {
            return this._extension;
        },

        /**
         * @method getViewState
         * returns 'close','attach','detach','minimize','restore','minimize'
         */
        getViewState: function () {
            return this.viewstate;
        },
        setViewState: function (viewstate) {
            this.viewstate = viewstate;
        },

        /**
         * @method getViewInfo
         * returns a property with view dimension info (currently WHEN in restored or detached state)
         */
        getViewInfo: function () {
            return this.viewinfo;
        },
        setViewInfo: function (viewinfo) {
            this.viewinfo = viewinfo;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });

/* Inheritance */
