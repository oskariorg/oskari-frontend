Oskari.clazz
    .define(
        'Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StopDrawFilteringRequest',
        function (isCancel) {
            this._creator = null;
            this._isCancel = (isCancel == true);
        }, {
            __name: "DrawFilterPlugin.StopDrawFilteringRequest",
            getName: function () {
                return this.__name;
            },
            isCancel: function () {
                return (this._isCancel === true);
            }
        }, {
            'protocol': ['Oskari.mapframework.request.Request']
        });

/* Inheritance */