Oskari.clazz
    .define(
        'Oskari.analysis.bundle.analyse.request.AnalyseRequest',
        function (selections) {
            this._creator = null;
            this._selections = selections;
        },
        {
            __name: "analyse.AnalyseRequest",
            getName: function () {
                return this.__name;
            },
            getSelections: function () {
                return this._selections;
            }
        },

        {
            'protocol': ['Oskari.mapframework.request.Request']
        }
    );

/* Inheritance */