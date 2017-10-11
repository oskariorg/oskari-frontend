/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin
 * Provides control UI for timeseries
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} delegate
     *      Object that has all the answers
     */
    function (delegate, conf) {
        var me = this;
        me._clazz = 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin';
        me._defaultLocation = 'bottom center';
        me._index = 90;
        me._name = 'TimeseriesControlPlugin';

        me._delegate = delegate;

        me._uiState = {
            times: null,
            currentTime: null,
            rangeStart: null,
            rangeEnd: null,
            isAnimating: false
        };

        var times = delegate.getTimes();
        this._uiState.times = times;
        this._uiState.rangeStart = times.start;
        this._uiState.rangeEnd = times.end;
        this._uiState.currentTime = delegate.getCurrentTime();

        me._mobileDefs = {
            buttons: {
                'mobile-featuredata': {
                    iconCls: 'mobile-info-marker',
                    tooltip: '',
                    sticky: true,
                    toggleChangeIcon: true,
                    show: true,
                    callback: function () {

                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
    }, {
        __timelineWidth: 600,
        /**
         * @method _createControlElement
         * @private
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         */
        _createControlElement: function () {
            var me = this,
                sandbox = me.getSandbox(),
                el = jQuery(
                    '<div class="mapplugin timeseriescontrolplugin">' +
                        '<div class="timeseries-aux"></div><div class="timeseries-timelines"><svg class="timeline-desktop">' +
                            '<g class="full-axis"></g>' +
                            '<g class="full-axis-brush"></g>' +
                            '<g class="full-subset"></g>' +
                            '<g class="drag-handle"><circle cx="0" cy="0" r="10"></circle></g>' +
                        '</svg></div>' +
                    '</div>');
            return el;
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            var me = this;
            var sandbox = me.getSandbox();
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            if (!toolbarNotReady && mapInMobileMode) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            } else {
                me._element = me._createControlElement();
                this.addToPluginContainer(me._element);
                me._initStepper();
                me._updateTimelines();
            }
        },
        _initStepper: function() {
            var me = this;
            var template = jQuery(
                '<div class="timeseries-stepper">' +
                    '<div class="timeseries-back"></div><div class="timeseries-playpause"></div><div class="timeseries-forward"></div><div class="timeseries-datetime"></div>' +
                '</div>');
            var dateTimeInput = Oskari.clazz.create('Oskari.userinterface.component.TextInput');
            dateTimeInput.setName('datetime');
            template.find('.timeseries-datetime').append(dateTimeInput.getElement());
            template.find('.timeseries-playpause').on('click', function(e){
                me._setAnmationState(!me._uiState.isAnimating);
            });
            this._element.find('.timeseries-aux').append(template);
        },
        _updateTimelines: function() {
            var me = this;
            var svg = d3.select(this._element.find('.timeline-desktop').get(0));
            svg
                .attr('width', this.__timelineWidth)
                .attr('height', 100);

            var times = this._uiState.times;
            var scaleFull = d3.scaleTime()
                .domain([new Date(times.start), new Date(times.end)])
                .range([0, this.__timelineWidth]);

            var scaleSubset = d3.scaleTime()
                .domain([new Date(this._uiState.rangeStart), new Date(this._uiState.rangeEnd)])
                .range([0, this.__timelineWidth]);

            var axisFull = d3.axisTop(scaleFull);
            svg.select('.full-axis')
                .attr('transform', 'translate(0,30)')
                .call(axisFull);

            var axisSubset = d3.axisTop(scaleSubset);
            svg.select('.full-subset')
                .attr('transform', 'translate(0,80)')
                .call(axisSubset);

            var handle = svg.select('g.drag-handle')
                .attr('transform', 'translate('+ scaleSubset(new Date(this._uiState.currentTime)) +',80)')
                .on(".drag", null); // remove old event handlers

            function updateHandle(newTime) {
                var newX = scaleSubset(new Date(newTime));
                handle.attr('transform', 'translate('+ newX +',80)');
                me._uiState.currentTime = newTime;
                // TODO: debounce & send to delegate
            }
            
            var dragBehavior = d3.drag()
            .on('drag', function(){
                var newX = d3.event.x;
                var scaleRange = scaleSubset.range();
                if(newX > scaleRange[1]) {
                    newX = scaleRange[1];
                }
                if(newX < scaleRange[0]) {
                    newX = scaleRange[0];
                }
                updateHandle(scaleSubset.invert(newX).toISOString());
            })
            .on('end', function(){
                // if brush too small, enlarge it
            })

            handle.call(dragBehavior);

            var brush = d3.brushX()
                .extent([[0, 0], [this.__timelineWidth, 50]])
                .handleSize(40)
                .on(".brush", null) // remove old event handlers
                .on('brush', brushed);

            svg.select('.full-axis-brush')
                .attr('class', 'brush')
                .call(brush)
                .call(brush.move, [scaleFull(new Date(this._uiState.rangeStart)), scaleFull(new Date(this._uiState.rangeEnd))]);

            function brushed() {
                var selection = d3.event.selection;
                var inverted = selection.map(scaleFull.invert, scaleFull);
                scaleSubset.domain(inverted);
                svg.select('.full-subset').call(axisSubset);
                var invertedISO = inverted.map(function(e){return e.toISOString()});

                var currentTime = me._uiState.currentTime;
                if(invertedISO[0] > me._uiState.currentTime) {
                    currentTime = invertedISO[0];
                }
                if(invertedISO[1] < me._uiState.currentTime) {
                    currentTime = invertedISO[1];
                }
                updateHandle(currentTime);
            }
        },

        teardownUI: function () {
            //remove old element
            this.removeFromPluginContainer(this.getElement());
        },

        _setAnmationState: function(shouldAnimate){
            this._uiState.isAnimating = shouldAnimate;
            this._element.find('.timeseries-playpause').toggleClass('pause', shouldAnimate);
        },

        _createEventHandlers: function () {
            return {
            };
        },

    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
