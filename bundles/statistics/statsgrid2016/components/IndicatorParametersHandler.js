Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorParameterHandler', function (service, locale) {
    this.service = service;
    this.locale = locale;
    this._values = null;
    this.datasource = null;
    this.indicators = null;
    this.elements = null;

    Oskari.makeObservable(this);
}, {
    getData: function ( datasrc, indicators, elements ) {

        this.datasource = datasrc;
        this.indicators = indicators;
        this.elements = elements;

        if ( Array.isArray( indicators ) ) {
            this.handleMultipleIndicators(datasrc, indicators, elements);
            return;
        }
        this.handleSingleIndicator(datasrc, indicators, elements);
    },
    handleSingleIndicator: function( indId, cb) {
        var me = this;
        var errorService = me.service.getErrorService();
        var locale = this.locale;
        var panelLoc = locale.panels.newSearch;

        this.service.getIndicatorMetadata(this.datasource, indId, function (err, indicator) {
            if (me.elements.dataLabelWithTooltips) {
                me.elements.dataLabelWithTooltips.find('.tooltip').hide();
            }
            if (err) {
                // notify error!!
                errorService.show(locale.errors.title, locale.errors.indicatorMetadataError);
                return;
            }

            // selections
            var selections = [];
            var combinedValues = {};

            indicator.selectors.forEach(function (selector, index) {
                selector.allowedValues.forEach(function (val) {
                    if ( !combinedValues[selector.id] ) {
                        combinedValues[selector.id] = [];
                    }

                    var name = val.name || val.id || val;
                    val.title = val.name;
                    var optName = (panelLoc.selectionValues[selector.id] && panelLoc.selectionValues[selector.id][name]) ? panelLoc.selectionValues[selector.id][name] : name;

                    var valObject = {
                        id: val.id || val,
                        title: optName
                    };
                    combinedValues[selector.id].push(valObject);
                    selections.push(valObject);
                });
            });

            if (indicator.regionsets.length === 0) {
                errorService.show(locale.errors.title, locale.errors.regionsetsIsEmpty);
            }

            // Add margin if there is selections
            if (indicator.selectors.length > 0) {
                //regionSelect.container.addClass('margintop');
            } else {
                errorService.show(locale.errors.title, locale.errors.indicatorMetadataIsEmpty);
            }

            var data = {
                datasrc: me.datasource,
                indicators: me.indicators,
                selectors: selections,
                regionset: indicator.regionsets,
                values: combinedValues
            }
            cb(data);
            //me.trigger('Data.Loaded', data);
        });
    },
    handleMultipleIndicators: function (datasrc, indicators, elements) {
        indicators = indicators.filter( function (n) { return n != "" } );
        var me = this;
        var panelLoc = this.locale.panels.newSearch;
        var combinedValues = {};
        var regionsets = [];
        var deferredArray = [];

        indicators.forEach( function (indId) {
            var deferred = new jQuery.Deferred();
            me.handleSingleIndicator(indId, function (value) {

                if (value.regionset.length === 0) {
                    errorService.show(locale.errors.title, locale.errors.regionsetsIsEmpty);
                } else {
                    regionsets =  regionsets.concat(value.regionset);
                }

                Object.keys(value.values).forEach( function(key) {
                    if ( !combinedValues[key] ) {
                        combinedValues[key] = value.values[key];
                    } else {
                        value.values[key].forEach( function (val) {
                            var inArray =  combinedValues[key].some( function (obj) {
                                return obj.id === val.id;
                            });
                            if ( !inArray ) {
                                combinedValues[key].push(val);
                            } else { console.log("value exits" + val);}
                        })
                    }
                });
                deferred.resolve();
            });
            deferredArray.push(deferred);
        });

    jQuery.when.apply( jQuery, deferredArray ).done( function() {

        var data = {
            datasrc: me.datasource,
            indicators: me.indicators,
            selectors: null,
            regionset: regionsets,
            values: combinedValues
        }
        me.trigger('Data.Loaded', data);
    });
    }
});