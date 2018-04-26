Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorParameterHandler', function (service, locale) {
    this.service = service;
    this.locale = locale;
    this._values = null;
    this.datasource = null;
    this.indicators = null;

    Oskari.makeObservable(this);
}, {
    getData: function ( datasrc, indicators, elements ) {

        this.datasource = datasrc;
        this.indicators = indicators;

        if ( Array.isArray( indicators ) ) {
            this.handleMultipleIndicators(datasrc, indicators, elements);
            return;
        }
        this.handleSingleIndicator(datasrc, indicators, elements);
    },
    handleSingleIndicator: function(datasrc, indId, elements) {
        var me = this;
        var errorService = me.service.getErrorService();
        var locale = this.locale;
        var panelLoc = locale.panels.newSearch;

        this.service.getIndicatorMetadata(datasrc, indId, function (err, indicator) {
            if (elements.dataLabelWithTooltips) {
                elements.dataLabelWithTooltips.find('.tooltip').hide();
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
                regionSet: indicator.regionsets,
                values: combinedValues
            }

            me.trigger('Data.Loaded', data);
        });
    },
    handleMultipleIndicators: function (datasrc, indicators, elements) {
        indicators = indicators.filter( function (n) { return n != "" } );
        var me = this;
        var panelLoc = this.locale.panels.newSearch;
        var allSelectors = [];
        var regionsSets = [];
        var deferredArray = [];

        indicators.forEach( function (indicatorId) {
            var deferred = new jQuery.Deferred();
            me.service.getIndicatorMetadata(datasrc, indicatorId, function (err, indicator) {
                indicator.selectors.forEach( function (selector) {
                    allSelectors.push(selector);
                });

                if (indicator.regionsets.length === 0) {
                    errorService.show(locale.errors.title, locale.errors.regionsetsIsEmpty);
                } else {
                   regionsSets =  regionsSets.concat(indicator.regionsets);
                }

                deferred.resolve();
            });
            deferredArray.push(deferred);
        });
        // when all the deferreds have been resolved -> proceed with handling data
        jQuery.when.apply( jQuery, deferredArray ).done( function() {

            allSelectors.sort(function (a, b) {
                return a.id > b.id ? 1 : -1;
            });

            var sharedSelectors = allSelectors;
            for ( var i = 0; i < sharedSelectors.length-1; i++ ) {
                if ( sharedSelectors[i].id === sharedSelectors[i+1].id ) {
                    sharedSelectors.splice( 1, i )
                }
            }
    
            var combinedValues = {};
            //get all the values from all the indicators and store them under their id key
            allSelectors.forEach( function (key) {
                key.allowedValues.forEach(function (val) {
                    if ( !combinedValues[key.id] ) {
                        combinedValues[key.id] = [];
                    }
                    var name = val.name || val.id || val;
                    val.title = val.name;
                    var optName = (panelLoc.selectionValues[key.id] && panelLoc.selectionValues[key.id][name]) ? panelLoc.selectionValues[key.id][name] : name;
        
                    var valObject = {
                        id: val.id || val,
                        title: optName
                    };
                    // check if selections contains the value already
                    if ( !combinedValues[key.id].some(function(key) { return key.id === valObject.id && key.title === valObject.title; }) ) {
                        combinedValues[key.id].push(valObject);
                    } 
                });
            });
            var data = {
                datasrc: me.datasource,
                indicators: me.indicators,
                selectors: sharedSelectors,
                regionSet: regionsSets,
                values: combinedValues
            }
            me.trigger('Data.Loaded', data);
        });
    },
    testRegionset: function ( datasrc, regionsets ) {
        regionsets = regionsets.map( function (id)  { return Number(id) } );
        this.service.getIndicatorList( datasrc, function ( err, indicator ) {
            indicator.indicators.forEach( function (ind) {
                if ( _.intersection(ind.regionsets, regionsets).length === 0 ) {
                    //regionset not supported
                }
            })
        });
    }
});