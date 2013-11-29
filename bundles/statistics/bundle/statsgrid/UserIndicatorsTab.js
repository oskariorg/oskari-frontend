/**
 * @class Oskari.statistics.bundle.statsgrid.UserIndicatorsTab
 * Renders the tab displaying user's own indicators and allowing them to create new ones.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.UserIndicatorsTab',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
 * 		reference to the statsgrid instance
 * @param {Object} localization
 *      instance's localization
 */
function(instance, localization) {
    this.instance = instance;
    this.loc = localization;
    this.visibleFields = ['name', 'description'];
    this.grid = null;
    this.container = null;
    this.template = jQuery(
        '<div class="userIndicatorsList">' +
            '<div class="indicatorsGrid"></div>' +
            '<button id="createNewIndicator">' + this.loc.newIndicator + '</button>' +
        '</div>'
    );

    // init
    this.init();
}, {
    /**
     * @method getName
     * @return {String} name of the component
     * (needed because we fake to be module for listening to
     * events (getName and onEvent methods are needed for this))
     */
    getName : function() {
        return 'StatsGrid.UserIndicatorsTab';
    },

    getTitle : function() {
        return this.loc.title;
    },

    getContent : function() {
        return this.container;
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {},
    /**
     * Binds event handlers, sets the container and
     * fetches the user created indicators.
     *
     * @method init
     * @return {undefined}
     */
    init: function() {
        var me = this;

        this.bindEvents();
        this.container = this.template.clone();
        // Bind the "Add new indicator" button to show the form
        this._bindAddNewIndicator(this.container);
        // Retrieve the indicators from the service
        var service = this.instance.getUserIndicatorsService();
        service.getUserIndicators(function(indicators) {
            // success!
            me._renderIndicators(indicators);
        }, function() {
            // error :(
            alert("Couldn't load indicators");
        });
    },
    /**
     * Requests to add the tab to personal data.
     *
     * @method _requestToAddTab
     * @return {undefined}
     */
    _requestToAddTab: function() {
        var title =  this.getTitle(),
            content = this.getContent(),
            sandbox = this.instance.getSandbox(),
            reqBuilder = sandbox.getRequestBuilder('PersonalData.AddTabRequest'),
            req;

        if (reqBuilder) {
            req = reqBuilder(title, content);
            sandbox.request(this.instance, req);
        }
    },
    /**
     * Creates the grid to show the user's indicators.
     *
     * @method _createUserIndicatorsGrid
     * @param {Oskari.userinterface.component.GridModel} model
     * @return {Oskari.userinterface.component.Grid}
     */
    _createUserIndicatorsGrid: function(model) {
        var me = this,
            grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');

        grid.setVisibleFields(this.visibleFields);
        grid.setDataModel(model);

        grid.setColumnValueRenderer('name', function(name, data) {
            return jQuery('<div></div>').html(name).
                click(function() {
                    me._showUserIndicator(data.id);
                });
        });

        _.each(this.visibleFields, function(field) {
            grid.setColumnUIName(field, me.loc.grid[field]);
        });

        return grid;
    },
    /**
     * Renders the indicators to the model and creates the grid to hold them.
     *
     * @method _renderIndicators
     * @param  {Array[Object]} indicators
     * @return {undefined}
     */
    _renderIndicators: function(indicators) {
        var lang = Oskari.getLang(),
            gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');

        gridModel.setIdField('id');

        _.each(indicators, function(indicator) {
            gridModel.addData({
                'id': indicator.id,
                'name': indicator.title[lang],
                'description': indicator.description[lang]
            });
        });

        this.grid = this._createUserIndicatorsGrid(gridModel);
        this.grid.renderTo(this.container.find('div.indicatorsGrid'));
        this._requestToAddTab();
    },
    /**
     * Retrieves the indicator through the service.
     *
     * @method _showUserIndicator
     * @param  {Number} indicatorId
     * @return {undefined}
     */
    _showUserIndicator: function(indicatorId) {
        var me = this,
            instance = this.instance;
            service = instance.getUserIndicatorsService();

        service.getUserIndicator(indicatorId, function(indicator) {
            // TODO: go to the thematic maps mode
            instance.addUserIndicator(me._normalizeIndicator(indicator));
        }, function() {
            // error :(
        });
    },
    /**
     * Binds the action of the "Add new indicator" button.
     *
     * @method _bindAddNewIndicator
     * @param  {jQuery} container
     * @return {undefined}
     */
    _bindAddNewIndicator: function(container) {
        var me = this,
            button = container.find('button#createNewIndicator');
        button.click(function() {
            me._showAddIndicatorForm();
        });
    },
    /**
     * Shows the form where users can create new indicators.
     *
     * @method _showAddIndicatorForm
     * @return {undefined}
     */
    _showAddIndicatorForm: function() {
        // TODO: create a form to create a new indicator and display it to the user.
        alert('Not implemented yet');
    },

    /**
     * Normalizes the indicator to be used as a sotkanet indicator.
     *
     * @method _normalizeIndicator
     * @param  {Object} indicator
     * @return {Object}
     */
    _normalizeIndicator: function(indicator) {
        indicator.ownIndicator = true;
        indicator.gender = 'total';
        indicator.organization = {
            'title': indicator.organization
        };
        indicator.meta = {
            'title': indicator.title
        };

        return indicator;
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event an Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler)
            return;

        return handler.apply(this, [event]);

    },
    /**
     * @method bindEvents
     * Register tab as eventlistener
     */
    bindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

    },
    /**
     * @method unbindEvents
     * Unregister tab as eventlistener
     */
    unbindEvents : function() {
        var instance = this.instance;
        var sandbox = instance.getSandbox();
        // faking to be module with getName/onEvent methods
        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }
    }
});
