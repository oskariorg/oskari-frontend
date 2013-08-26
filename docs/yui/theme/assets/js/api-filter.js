YUI.add('api-filter', function (Y) {

Y.APIFilter = Y.Base.create('apiFilter', Y.Base, [Y.AutoCompleteBase], {
    // -- Initializer ----------------------------------------------------------
    initializer: function () {
        this._bindUIACBase();
        this._syncUIACBase();
    },
    getDisplayName: function(name) {

        Y.each(Y.YUIDoc.meta.allModules, function(i) {
            if (i.name === name && i.displayName) {
                name = i.displayName;
            }
        });

        var parts = name.split('.');
        if(parts.length > 0) {
            var text = '';
            if(parts.length > 1) {
                text += parts[parts.length - 2] + '.';
            }
            text += parts[parts.length - 1];
        }
        name= text;

        return name;
    }

}, {
    // -- Attributes -----------------------------------------------------------
    ATTRS: {
        resultHighlighter: {
            value: 'phraseMatch'
        },

        // May be set to "classes" or "modules".
        queryType: {
            value: 'classes'
        },

        source: {
            valueFn: function() {
                var self = this;
                return function(q) {
                    var data = Y.YUIDoc.meta[self.get('queryType')],
                        out = [];
                    Y.each(data, function(v) {
                        if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                            out.push(v);
                        }
                    });
                    return out;
                };
            }
        }
    }
});

}, '3.4.0', {requires: [
    'autocomplete-base', 'autocomplete-highlighters', 'autocomplete-sources'
]});
