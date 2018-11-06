Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorList', function (service) {
    this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
    this.element = null;
    this.service = service;
    this._removeAllBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    this._wrapper = jQuery('<div class="statsgrid-indicator-list-wrapper"></div>');
    this._content = jQuery('<div class="statsgrid-indicator-list-content"><ol class="statsgrid-indicator-list"></ol></div>');
    this._bindToEvents();
}, {
    __templates: {
        indicator: _.template('<li><div>${name} <div class="indicator-list-remove icon-close" data-ind-hash="${indHash}"/></div></li>'),
        empty: _.template('<li>${emptyMsg}</li>')
    },
    /**
     * @method getElement
     * @return {Object} jQuery element
     */
    getElement: function () {
        if (!this.element) {
            this._initializeElement();
        }
        return this.element;
    },
    /**
     * @method _bindToEvents
     */
    _bindToEvents: function () {
        var me = this;
        // Rerender indicator list on indicator event
        me.service.on('StatsGrid.IndicatorEvent', function (event) {
            me._updateIndicatorList();
        });
    },
    /**
     * @method _getIndicators
     * Get indicators via {Oskari.statistics.statsgrid.StateService}
     * @return {Array}
     */
    _getIndicators: function () {
        return this.service.getStateService().getIndicators();
    },
    /**
     * @method _getIndicatorList
     * Populates _content element with indicators
     * @return {Object} jQuery element
     */
    _getIndicatorList: function () {
        var me = this;
        var content = me._content;
        // Remove any old content
        content.find('.statsgrid-indicator-list').empty();
        // Get indicators and add them to content using template
        var indicators = me._getIndicators();
        indicators.forEach(function (ind, id) {
            me.service.getUILabels(ind, function (labels) {
                var indElem = jQuery(me.__templates.indicator({
                    name: labels.full,
                    indHash: ind.hash
                }));
                content.find('.statsgrid-indicator-list').append(indElem);
                // Add event listener for removing indicator
                indElem.find('.icon-close').on('click', function () {
                    me.service.getStateService().removeIndicator(ind.datasource, ind.indicator, ind.selections, ind.series);
                });
            });
        });
        return content;
    },
    /**
     * @method _initializeElement
     * Initializes wrapper element with its contents
     */
    _initializeElement: function () {
        var me = this;
        // Create wrapper element
        this.element = me._wrapper;
        // Create indicator list content
        var content = me._content;
        // Create 'remove all' button
        var removeAllBtn = me._removeAllBtn;
        removeAllBtn.setTitle(me.loc('indicatorList.removeAll'));
        removeAllBtn.setHandler(function () {
            me._removeAllIndicators();
        });
        // Add button to content
        removeAllBtn.insertTo(content);
        // Add content to element
        this.element.append(content);
        // Update indicator list
        me._updateIndicatorList();
    },
    /**
     * @method _removeAllIndicators
     * Removes all indicators via {Oskari.statistics.statsgrid.StateService}
     */
    _removeAllIndicators: function () {
        this.service.getStateService().reset();
        this._updateIndicatorList();
    },
    /**
     * @method _updateIndicatorList
     * Updates indicator list
     */
    _updateIndicatorList: function () {
        var me = this;
        var indicators = me._getIndicatorList();
        me.element.find('.statsgrid-indicator-list-content').replaceWith(indicators);
        if (indicators.find('li').length === 0) {
            // No indicators in the list. Hide 'remove all' button and display message
            indicators.find('.statsgrid-indicator-list').append(jQuery(me.__templates.empty({
                emptyMsg: me.loc('indicatorList.emptyMsg')
            })));
            me._removeAllBtn.setVisible(false);
        } else {
            me._removeAllBtn.setVisible(true);
        }
    }
});
