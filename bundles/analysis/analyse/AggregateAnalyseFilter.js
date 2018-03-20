/**
 * @class Oskari.analysis.bundle.analyse.AggregateAnalyseFilter
 *
 * Adds to the filterDialog the possibility to filter with aggregate analyse values
 */
Oskari.clazz.define("Oskari.analysis.bundle.analyse.aggregateAnalyseFilter",

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.userinterface.component.FilterDialog} filterDialog
     */

    function(instance, filterDialog) {
        this.instance = instance;
        this.localization = filterDialog.loc;
        this.filterDialog = filterDialog;
    }, {

        /**
         * @method addAggregateFilterFunctionality
         * @param {Array} aggregateAnalysis
         * Adds multiLevelSelect or shows advertisingtext after user clicks the link to filter with aggregate value
         */
        addAggregateFilterFunctionality: function(aggregateAnalysis) {
            var me = this;
            me.content = me.filterDialog.popup.dialog.find('.analyse-filter-popup-content');

            if (me.filterDialog.popup.dialog.find('.add-link')) {
                me.filterDialog.popup.dialog.on('click', '.add-link', function(event) {
                    if (aggregateAnalysis.length === 0) {
                        me.aggregateAnalyseFilter.showAdvertisingText();
                    } else {
                        me.content.find('.input-blink').removeClass("input-blink");
                        jQuery(event.target).parent().parent().find('input[name=attribute-value]').addClass("input-blink");
                        var aggregateSelect = me.content.find('.filter-popup-multiselect');
                        if (aggregateSelect) {
                            aggregateSelect.remove();
                        }
                        me.aggregateAnalyseFilter.addAggregateValuesSelect(aggregateAnalysis, function(value) {
                            jQuery(event.target).parent().parent().find('input').val(value);
                            me.aggregateAnalyseFilter._blink(jQuery(event.target).parent().parent().find('input'));
                        });
                    }
                });
            }
        },

        /**
         * @method showAdvertisingText
         * shows text advertising analyse aggregate values if user doesn't have any
         */
        showAdvertisingText: function() {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton'),
                title = this.localization.aggregateAnalysisFilter.noAggregateAnalysisPopupTitle,
                content = this.localization.aggregateAnalysisFilter.noAggregateAnalysisPopupContent;
            okBtn.setPrimary(true);
            okBtn.setHandler(function() {
                dialog.close(true);
            });
            dialog.show(title, content, [okBtn]);
            dialog.makeModal();
        },

        /**
         * @method _blink
         * blinks the input element when aggregate value is selected
         */
        _blink: function(element) {
            if (!element) {
                return;
            }
            // animate to low opacity
            element.animate({
                opacity: 0.25
            }, 250, function() {
                // on complete, animate back to fully visible
                element.animate({
                    opacity: 1
                });
            });
        },

        /**
         * @method addAggregateValuesSelect
         * renders MultiLevelSelect to content with aggregateValues
         */
        addAggregateValuesSelect: function(aggregateAnalysis, callback) {
            var me = this;

            me.content = me.filterDialog.popup.dialog.find('.analyse-filter-popup-content');

            // Get values for first select
            var options = _.map(aggregateAnalysis, function(aggregateAnalyse) {
                var analyse = {
                    title: aggregateAnalyse.name,
                    value: aggregateAnalyse.wpsLayerId
                };
                return analyse;
            });
            options.unshift({
                title: me.localization.aggregateAnalysisFilter.selectAggregateAnalyse
            });

            this.aggregateValuesSelect = Oskari.clazz.create('Oskari.userinterface.component.MultiLevelSelect');

            me.content.append('<div class="filter-popup-multiselect"><div class="header"><div class="icon-close"></div><h3 class="popupHeader">' + me.localization.aggregateAnalysisFilter.aggregateValueSelectTitle + '</h3></div></div>');
            me.selectValues = [{
                options: options
            }];
            me.aggregateValuesSelect.setOptions(me.selectValues);
            me.aggregateValuesSelect.insertTo(me.content.find('.filter-popup-multiselect'));

            me.content.find('.icon-close').on('click', function() {
                me.content.find('.filter-popup-multiselect').remove();
                me._turnOnClickOff();
                me.content.find('.input-blink').removeClass("input-blink");
            });

            me._cachedAggregateValue = [-1];
            me.aggregateValuesSelect.setHandler(function(value) {
                var aggregateValue = value[0];
                if (!_.isUndefined(aggregateValue)) {
                    var _valueDifference = _.difference(me._cachedAggregateValue, value);
                    //we always assume that _valueOfDifference returns an array with one value
                    var indexofChangedValue = _.indexOf(me._cachedAggregateValue, _valueDifference[0]);
                    me._cachedAggregateValue = value;
                    if (indexofChangedValue === 0) {
                        me.getAggregateAnalysisJSON(value[0]);
                    }
                    if (indexofChangedValue === 1) {
                        if (value[1] !== "undefined") {
                            me.parseLastSelect(value[1]);
                        }
                    }
                    if (indexofChangedValue === 2) {
                        if (value[2] !== "undefined") {
                            me.useAggregateValue(value[2], callback);
                        }
                    }
                }
            });
        },

        /**
         * @method getAggregateAnalysisJSON
         * @param {integer} analyse_id
         */
        getAggregateAnalysisJSON: function(analyse_id) {
            var me = this;
            var url = Oskari.getSandbox().getAjaxUrl() + 'action_route=GetAnalysisData&analyse_id=' + analyse_id;
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                success: function(result) {
                    me.handleResult(result);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);
                    me._openPopup(
                        me.localization.aggregateAnalysisFilter.getAggregateAnalysisFailed,
                        error
                    );
                }
            });
        },

        /**
         * @method handleResult
         * @param {array} data
         * parses aggregate analysis JSON to correct format for MultiLevelSelect
         * creates the second select of MultiLevelSelect
         */
        handleResult: function(data) {
            var me = this,
                index = 1,
                options = [];

            if (me.selectReadyButton) {
                me.content.find('.oskari-filter-with-aggregateAnalysis').remove();
                me.selectReadyButton = undefined;
            }
            me.indicatorData = data.analysisdata;

            me.indicatorData.forEach(function(indicatorItem) {

                var datasets = _.keys(indicatorItem);

                var values = {
                    title: datasets[0],
                    value: datasets[0]
                };

                options.push(values);
            });
            options.unshift({
                title: me.localization.aggregateAnalysisFilter.selectIndicator
            });
            var updateValues = {
                options: options
            };


            me.selectValues[index] = updateValues;
            var ilen = index + 1;
            while (ilen < me.selectValues.length) {
                me.selectValues.pop();
            }
            me.aggregateValuesSelect.setOptions(me.selectValues);
        },

        /**
         * @method parseLastSelect
         * @param {string} keyValue
         * parses options for last select
         */
        parseLastSelect: function(keyValue) {
            var me = this,
                index = 2,
                options = [],
                datasets = _.find(me.indicatorData, function(obj) {
                    return obj.hasOwnProperty(keyValue);
                })[keyValue];

            for (var key in datasets) {
                if (datasets.hasOwnProperty(key)) {
                    options.push({
                        title: key + ':   ' + datasets[key],
                        value: datasets[key]
                    });
                }
            }
            var updateLastValues = {
                multiple: true,
                options: options
            };
            me.selectValues[index] = updateLastValues;
            me.aggregateValuesSelect.setOptions(me.selectValues);
            if (_.isUndefined(me.selectReadyButton)) {
                me.selectReadyButton = '<input class="oskari-button primary oskari-filter-with-aggregateAnalysis" type="button" value=' + me.localization.aggregateAnalysisFilter.selectReadyButton + '>';
                me.content.find('.oskari-multilevelselect').append(me.selectReadyButton);
            }
            me.content.on('click', '.oskari-filter-with-aggregateAnalysis', function() {
                me.content.find('.filter-popup-multiselect').remove();
                me._turnOnClickOff();
                me.content.find('.input-blink').removeClass("input-blink");
            });
        },

        /**
         * @method useAggregateValue
         */
        useAggregateValue: function(key, callback) {
            callback(key);
        },

        /**
         * @method _openPopup
         * opens a modal popup, no buttons or anything.
         */
        _openPopup: function(title, content) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
            okBtn.setPrimary(true);
            okBtn.setHandler(function() {
                dialog.close(true);
            });
            dialog.show(title, content, [okBtn]);
            dialog.makeModal();
        },

        _turnOnClickOff: function() {
            var me = this;
            me.content.off('click', '.oskari-filter-with-aggregateAnalysis');
            me.content.find('.icon-close').off('click');
        },

        _getErrorText: function(jqXHR, textStatus, errorThrown) {
            var error = errorThrown.message || errorThrown,
                err;
            try {
                err = JSON.parse(jqXHR.responseText).error;
                if (err !== null && err !== undefined) {
                    error = err;
                }
            } catch (ignore) {
                return '';
            }
            return error;
        }
    });