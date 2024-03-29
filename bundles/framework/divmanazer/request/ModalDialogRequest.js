/**
 * @class Oskari.userinterface.request.ModalDialogRequest
 */
Oskari.clazz
    .define('Oskari.userinterface.request.ModalDialogRequest',
        function (title, message, buttons, onshow) {
            this._title = title || 'Untitled';
            this._message = message || 'Lorem ipsum';
            this._buttons = buttons || {};
            this._parent = parent || jQuery(Oskari.dom.getRootEl());
            this._onshow = onshow || null;
        }, {
            __name: 'userinterface.ModalDialogRequest',
            getName: function () {
                return this.__name;
            },
            getTitle: function () {
                return this._title;
            },
            getMessage: function () {
                return this._message;
            },
            getButtons: function () {
                return this._buttons;
            },
            getGeom: function () {
                return this._geom;
            },
            getParent: function () {
                return this._parent;
            },
            getOnShow: function () {
                return this._onshow;
            }
        }, {
            'protocol': ['Oskari.mapframework.request.Request']
        });
