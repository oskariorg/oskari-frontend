/**
 * @class Oskari.userinterface.request.ModalDialogRequest
 */
Oskari.clazz
    .define('Oskari.userinterface.request.ModalDialogRequest',
        function (title, message, buttons, onshow) {
            "use strict";
            this._title = title ? title : "Untitled";
            this._message = message ? message : "Lorem ipsum";
            this._buttons = buttons ? buttons : {};
            this._parent = parent ? parent : jQuery('#mapdiv');
            this._onshow = onshow ? onshow : null;
        }, {
            __name: "userinterface.ModalDialogRequest",
            getName: function () {
                "use strict";
                return this.__name;
            },
            getTitle: function () {
                "use strict";
                return this._title;
            },
            getMessage: function () {
                "use strict";
                return this._message;
            },
            getButtons: function () {
                "use strict";
                return this._buttons;
            },
            getGeom: function () {
                "use strict";
                return this._geom;
            },
            getParent: function () {
                "use strict";
                return this._parent;
            },
            getOnShow: function () {
                "use strict";
                return this._onshow;
            }
        }, {
            'protocol': ['Oskari.mapframework.request.Request']
        });
