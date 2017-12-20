/**
 * @class Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance
 *
 * Main component and starting point for the "toolbar" functionality.
 * Provides functionality for other bundles to add buttons
 * for different functionalities
 *
 * See Oskari.mapframework.bundle.toolbar.ToolbarBundle for bundle definition.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this.buttons = {};
        this.selectedButton = null;
        this.defaultButton = null;
        this.container = null;
        this.menutoolbarcontainer = null;
        this.containers = {};
        this.toolbars = {};
        this.groupsToToolbars = {};
        this._toolbarConfigs = {};
        this.currentMeasureTool = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'Toolbar',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {},
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;
            me.conf = me.conf || {};
            // Should this not come as a param?
            var conf = me.conf,
                sandboxName = conf.sandbox || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            sandbox.register(me);
            me.setSandbox(sandbox);

            var defaultContainerId = conf.defaultToolbarContainer || '#toolbar';
            this.container = jQuery(defaultContainerId);
            this.containers['default'] = this.container;
            this.toolbars['default'] = this.container;

            var defaultMenuToolbarContainer = conf.defaultMenuToolbarContainer || '#menutoolbar',
                p;
            this.menutoolbarcontainer = jQuery(defaultMenuToolbarContainer);

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    if (p) {
                        sandbox.registerForEventByName(me, p);
                    }
                }
            }
            sandbox.requestHandler('Toolbar.AddToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
            sandbox.requestHandler('Toolbar.RemoveToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
            sandbox.requestHandler('Toolbar.ToolButtonStateRequest', this.requestHandlers.toolButtonRequestHandler);
            sandbox.requestHandler('Toolbar.SelectToolButtonRequest', this.requestHandlers.toolButtonRequestHandler);
            sandbox.requestHandler('Toolbar.ToolbarRequest', this.requestHandlers.toolbarRequestHandler);

            /* temporary fix */
            sandbox.requestHandler('ShowMapMeasurementRequest', this.requestHandlers.showMapMeasurementRequestHandler);

            sandbox.registerAsStateful(this.mediator.bundleId, this);

            // TODO: check if we want to do this
            if (this._addDefaultButtons) {
                this._addDefaultButtons();
            }

            // Toolbar available
            var event = Oskari.eventBuilder('Toolbar.ToolbarLoadedEvent')();
            sandbox.notifyAll(event);
            this._registerForGuidedTour();
        },
        /**
         * @static
         * @property templates
         *
         *
         */
        templates: {
            group: '<div class="toolrow"></div>',
            tool: '<div class="tool"></div>',
            menutoolbar: '<div class="oskari-closed oskariui-menutoolbar"><div class="oskariui-menutoolbar-modetitle"><div class="oskariui-menutoolbar-title"><p></p></div></div><div class="oskariui-menutoolbar-container"><div class="oskariui-menutoolbarbuttongroup"></div></div><div class="oskariui-menutoolbar-closebox"><div class="icon-close-white"></div></div></div>',
            addedToolbar: '<div class="oskariui-toolbar-title"><p></p></div><div class="oskariui-toolbar-container"><div class="oskariui-toolbarbuttongroup"></div></div>'
        },

        /**
         * @method init
         * implements Module protocol init method - initializes request handlers and templates
         */
        init: function () {
            var me = this;

            this.templateGroup = jQuery(this.templates.group);
            this.templateTool = jQuery(this.templates.tool);
            this.templateMenutoolbar = jQuery(this.templates.menutoolbar);

            this.requestHandlers = {
                toolButtonRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ToolButtonRequestHandler', me),
                toolbarRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ToolbarRequestHandler', me),
                showMapMeasurementRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.toolbar.request.ShowMapMeasurementRequestHandler', me)
            };

        },
        /**
         * @method createMenuToolbarContainer
         *
         */
        createMenuToolbarContainer: function (tbid, pdata) {
            var data = pdata || {};
            var tbcontainer = this.templateMenutoolbar.clone();
            this.menutoolbarcontainer.append(tbcontainer);
            this.toolbars[tbid] = tbcontainer;
            var c = tbcontainer.find(".oskariui-menutoolbarbuttongroup");
            this.containers[tbid] = c;
            if (data.title) {
                tbcontainer.find(".oskariui-menutoolbar-title p").append(data.title);
            }
            if (data.show) {
                tbcontainer.removeClass('oskari-closed');
            }
            if (data.closeBoxCallback) {
                tbcontainer.find(".oskariui-menutoolbar-closebox div").click(data.closeBoxCallback);
            }

            return c;
        },
        /**
         * @method createToolbarContainer
         *
         */
        addToolbarContainer: function (tbid, pdata) {
            var tbcontainer = pdata.toolbarContainer;
            tbcontainer.append(jQuery(this.templates.addedToolbar));
            this.toolbars[tbid] = tbcontainer;
            var c = tbcontainer.find('.oskariui-toolbarbuttongroup');
            this.containers[tbid] = c;

            if (pdata.title) {
                tbcontainer.find('.oskariui-toolbar-title p').append(pdata.title);
            } else {
                tbcontainer.find('.oskariui-toolbar-title').remove();
            }
            return c;
        },
        changeMenuToolbarTitle: function (title) {
            if (title) {
                this.menutoolbarcontainer.find(".oskariui-menutoolbar-title p").html(title);
            }
        },

        getToolBarConfigs: function(ptbid){
            var tbid = ptbid || 'default';
            return this._toolbarConfigs[tbid];
        },

        /**
         * @method getToolbarContainer
         * @return {jQuery} reference to the toolbar container
         */
        getToolbarContainer: function (ptbid, data) {
            var me = this;
            var tbid = ptbid || 'default';
            var c = this.containers[tbid];

            var showHover = (data && typeof data.disableHover === 'boolean') ? !data.disableHover : true;

            var createHoverStyle = false;
            if(c) {
                createHoverStyle = true;
            }

            if (c === undefined && this.menutoolbarcontainer && !data.toolbarContainer) {
                c = this.createMenuToolbarContainer(tbid, data);
            } else if ((c === undefined || c.parents('body').length === 0) && data && data.toolbarContainer) {
                c = this.addToolbarContainer(tbid, data);
                createHoverStyle = true;
            }

            if(!data) {
                data = {};
            }

            if(!data.colours) {
                data.colours = {
                    hover: (me.conf && me.conf.colours && me.conf.colours.hover) ? me.conf.colours.hover : '#3c3c3c',
                    background: (me.conf && me.conf.colours && me.conf.colours.background) ? me.conf.colours.background : '#333438'
                };

            } else {
                if(!data.colours.hover) {
                    data.colours.hover = '#3c3c3c';
                }
                if(!data.colours.background) {
                    data.colours.background = '#333438';
                }
            }
            data.colours = data.colours || {
                hover: (data && data.colours && data.colours.hover) ? data.colours.hover : '#3c3c3c'
            };

            var addHoverStyle = (createHoverStyle && data && showHover && !this._toolbarConfigs[tbid]) ? true : false;

            c.addClass('toolbar_' + tbid);
            if(addHoverStyle) {
                jQuery('<style type="text/css" id="toolbar_'+tbid+'_style">'+
                            'div.toolbar_' + tbid + ' div.toolrow div.tool:hover:not(.disabled):not(.selected) {' +
                            '   background-color: ' + data.colours.hover + ';' +
                            '}' +
                        '</style>').appendTo('head');
            }
            // TODO: Need to use this later? Can toolbar color defined in config / add toolbar request?
            // Add style for one time per toolbar
            /*
            if(!this._toolbarConfigs[tbid]) {
                jQuery('<style type="text/css">'+
                        'div.toolbar_' + tbid + ' {' +
                        '   background-color: ' + data.colours.background + ';' +
                        '}' +
                    '</style>').appendTo('head');
            }
            */

            if(!this._toolbarConfigs[tbid]) {
                this._toolbarConfigs[tbid] = {
                    createdHover: (addHoverStyle && showHover) ? true : false,
                    colours: data.colours
                };
            }


            return c;
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            var me = this;
            var handler = me.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        measureTools: {
            "default-basictools": {
                "measureline": true,
                "measurearea": true
            }
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /*
             * @method ToolSelectedEvent
             * */
            "Toolbar.ToolSelectedEvent": function (event) {
                var me = this;
                var sandbox = this.getSandbox();

                me.currentMeasureTool = null;

                /* we'll show prompt if measure tool has been selected */
                if (!me.measureTools[event.getGroupId()]) {
                    return;
                }
                if (!me.measureTools[event.getGroupId()][event.getToolId()]) {
                    return;
                }
                me.currentMeasureTool = event.getToolId();

                var msg = me.getLocalization('measure').guidance[event.getToolId()];

                sandbox.request(me, Oskari.requestBuilder('ShowMapMeasurementRequest')(msg || "", false, null, null));

            }
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            var me = this,
                sandbox = me.sandbox(),
                p;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    if (p) {
                        sandbox.unregisterFromEventByName(me, p);
                    }
                }
            }

            /* temporary fix */
            sandbox.requestHandler('ShowMapMeasurementRequest', null);

            sandbox.requestHandler('Toolbar.ToolbarRequest', null);
            sandbox.requestHandler('Toolbar.AddToolButtonRequest', null);
            sandbox.requestHandler('Toolbar.RemoveToolButtonRequest', null);
            sandbox.requestHandler('Toolbar.ToolButtonStateRequest', null);
            sandbox.requestHandler('Toolbar.SelectToolButtonRequest', null);

            this.sandbox.unregisterStateful(this.mediator.bundleId);
            me.sandbox.unregister(me);
            me.started = false;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {

            if (!state) {
                // TODO: loop buttons and check which had selected = true for default tool
                return;
            }
            if (state.selected) {
                this.selectedButton = state.selected;
                // get references
                var tool = state.selected.id;
                var group = state.selected.group;
                var groupName = group.split('-');
                if (groupName.length < 2) {
                    // old configs don't have the toolbar id prefixed
                    group = 'default-' + group;
                }
                var toolbar = this.getToolbarContainer();

                // remove any old selection
                this._removeToolSelections();

                var groupContainer = toolbar.find('div.toolrow[tbgroup=' + group + ']');
                if (groupContainer.length > 0) {
                    var button = groupContainer.find('div.tool[tool=' + tool + ']');
                    if (button.length > 0) {
                        // select the new one
                        button.addClass('selected');
                        // "click" the button
                        this.buttons[group][tool].callback();
                    }
                    // if button has not yet been added
                    // we should obey the state in add button
                }
            } else {
                this.selectedButton = null;
            }
        },
        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            var state = {

            };
            if (this.selectedButton) {
                state.selected = this.selectedButton;
            }

            return state;
        },

        /**
         * @method _removeToolbar
         * removes named toolbar
         */
        _removeToolbar: function (tbid) {
            var tb = this.toolbars[tbid];
            if (tb) {
                tb.remove();
            }
            this.toolbars[tbid] = undefined;
            delete this.toolbars[tbid];
            this.containers[tbid] = undefined;
            delete this.containers[tbid];
            this._toolbarConfigs[tbid] = undefined;
            delete this._toolbarConfigs[tbid];
        },

        /**
         * @method _showToolbar
         * shows named toolbar
         */
        _showToolbar: function (tbid) {
            this.toolbars[tbid].show();
        },

        /**
         * @method _hideToolbar
         *
         * hides named toolbar
         */
        _hideToolbar: function (tbid) {
            this.toolbars[tbid].hide();
        },

        /**
         * @method _addToolbar
         * adds named toolbar
         */
        _addToolbar: function (tbid, data) {
            this.getToolbarContainer(tbid, data);
        },
        _updateToolbar: function(ptbid, data){
            var me = this;
            var tbid = ptbid || 'default';


            if(!data) {
                data = {};
            }

            if(!data.colours) {
                data.colours = {
                    hover: (me.conf && me.conf.colours && me.conf.colours.hover) ? me.conf.colours.hover : '#3c3c3c',
                    background: (me.conf && me.conf.colours && me.conf.colours.background) ? me.conf.colours.background : '#333438'
                };

            } else {
                if(!data.colours.hover) {
                    data.colours.hover = '#3c3c3c';
                }
                if(!data.colours.background) {
                    data.colours.background = '#333438';
                }
            }
            data.colours = data.colours || {
                hover: (data && data.colours && data.colours.hover) ? data.colours.hover : '#3c3c3c'
            };

            if(this._toolbarConfigs[tbid].createdHover === true) {
                jQuery('style#toolbar_'+tbid+'_style').remove();
                jQuery('<style type="text/css" id="toolbar_'+tbid+'_style">'+
                            'div.toolbar_' + tbid + ' div.toolrow div.tool:hover:not(.disabled):not(.selected) {' +
                            '   background-color: ' + data.colours.hover + ';' +
                            '}' +
                        '</style>').appendTo('head');
            }


            this._toolbarConfigs[tbid].colours = data.colours;


            // change toolbar toolicons
            var c = me.containers[tbid];
            if(c) {
                c.find('.tool').each(function(){
                    var button = jQuery(this);
                    var iconCls = button.attr('data-icon');
                    button.removeClass(iconCls + '-light');
                    button.removeClass(iconCls + '-dark');

                    var color = data.colours.background;
                    if(button.hasClass('selected') && button.attr('data-toggle-change-icon') === 'true' && button.attr('data-active-color')) {
                        color = button.attr('data-active-color');
                    }

                    if(Oskari.util.getColorBrightness(color) === 'light') {
                        button.addClass(iconCls + '-light');
                    } else {
                        button.addClass(iconCls + '-dark');
                    }
                });
            }

        },
        /**
         * @static
         * @property __guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplate: {
            priority: 60,
            getTitle: function () {
                return this.getLocalization().guidedTour.title
            },
            getContent: function () {
                var content = jQuery('<div></div>');
                content.append(this.getLocalization().guidedTour.message);
                return content;
            },
            getPositionRef: function () {
                return jQuery('#toolbar');
            },
            positionAlign: 'right'
        },

        /**
         * @method _registerForGuidedTour
         * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
         */
        _registerForGuidedTour: function() {
            var me = this;
            function sendRegister() {
                var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if(requestBuilder){
                    var delegate = {
                        bundleName: me.getName()
                    };
                    for(prop in me.__guidedTourDelegateTemplate){
                        if(typeof me.__guidedTourDelegateTemplate[prop] === 'function') {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop].bind(me); // bind methods to bundle instance
                        } else {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop]; // assign values
                        }
                    }
                    me.sandbox.request(me, requestBuilder(delegate));
                }
            }

            function handler(msg){
                if(msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            var tourInstance = me.sandbox.findRegisteredModuleInstance('GuidedTour');
            if(tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    });