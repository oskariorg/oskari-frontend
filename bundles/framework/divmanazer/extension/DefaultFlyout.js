/**
 * @class Oskari.userinterface.extension.DefaultFlyout
 *
 * Default Flyout implementation which shall be used as a super class
 * to actual implementations.
 *
 */
Oskari.clazz.define('Oskari.userinterface.extension.DefaultFlyout',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */
    function (instance, locale) {

        /* @property extension instance */
        this.instance = instance;

        /* @property locale locale for this */
        this.locale = locale;

        /* @property container the DIV element */
        this.container = null;

        this._sidetool = null;


    }, {
        __temp:{
            sideTool:_.template(
                '<div class="sidetool">'  +
                '<div class="icon icon-arrow-white-right"></div>' +
                '<label class="verticalsidelabel"></label>'  +
                '</div>')
        },
        //this function collects the label and calls the default flyout function addSideTool sending the label and the callback function.
        getSideLabel : function( text ) {
            var sidelabel = jQuery(this.__temp.sideTool());
            sidelabel.find('label').text(text);
            var sidelabels = this.container.parent().find('.sidetool');
            //sidelabel.css('bottom', sidelabels.length * (sidelabel.height() + 10 ) + 'px');
            return sidelabel;
        },
        _calcSideLabelPositions: function(){
            var me = this;
            var sidelabels = me.container.find('.sidetool');
            sidelabels.each(function(index, sidelabel) {
                if(index + 1 === sidelabels.length) {
                    jQuery(this).css('bottom', 0);
                }
                else {
                    jQuery(this).css('bottom', (index + 1) * (jQuery(this).height() + 10 ) + 'px');
                }
            });
        },
        addSideTool: function(label, callback){
            var me = this;
            var sidelabel = this.getSideLabel(label);
            this.container.append(sidelabel);
            if(typeof callback === 'function') {
                sidelabel.on('click', function() {
                    callback( sidelabel );
                });
            }

            me._calcSideLabelPositions();
/*
            if(!me._addedResizeListener){
                this.container.parent().bind('change', function(){
                    me._calcSideLabelPositions();
                    console.log('resize handling');
                });
                me._addedResizeListener = true;
            }
            */
        },

        /**
         * @method getName
         * @return {String} implementation name
         */
        getName: function () {
            return 'Oskari.userinterface.extension.DefaultFlyout';
        },

        /**
         * @method setEl
         * called by host to set DOM element for this Flyouts content
         */
        setEl: function (el) {
            this.container = jQuery(el);
        },

        /**
         * @method  getEl
         * @return {jQuery Object} wrapped DOM element for this Flyout's contents
         */
        getEl: function () {
            return this.container;
        },

        /**
         * @method startPlugin
         * called by host to start flyout operations
         */
        startPlugin: function () {
        },

        /**
         * @method stopPlugin
         * called by host to stop flyout operations
         */
        stopPlugin: function () {
        },

        /**
         * @method getTile
         * @return {String} called by host to get a localised flyout title
         */
        getTitle: function () {
            return this.locale.title;
        },
        /**
         * @method getDescriptions
         * @return {String} called by host to get a localised flyout description
         */
        getDescription: function () {
            return this.locale.description;
        },

        /**
         * @method setState
         * @param {JSON} sets state
         */
        setState: function (state) {
            this.state = state;
        },
        /**
         * @method getState
         * @return {JSON} returns state
         */
        getState: function () {
            return this.state;
        },

        /**
         * @method close
         * Closes the flyout
         */
        close : function() {
            var instance = this.getExtension();
            var sandbox = this.getSandbox();
            sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [instance, 'close']);
        },

        /**
         * @method getLocalization
         * @return JSON localisation subset 'flyout'
         */
        getLocalization: function () {
            return this.locale ? this.locale : (this.instance ? this.instance.getLocalization().flyout : undefined);
        },

        getSandbox: function () {
            return this.instance.getSandbox();
        },

        getExtension: function () {
            return this.instance;
        },

        /* o2 helpers for notifications and requetss */
        slicer: Array.prototype.slice,

        issue: function () {
            var requestName = arguments[0],
                args = this.slicer.apply(arguments, [1]),
                builder = this.getSandbox().getRequestBuilder(requestName),
                request = builder.apply(builder, args);
            return this.getSandbox().request(this.getExtension(), request);
        },

        notify: function () {
            var eventName = arguments[0],
                args = this.slicer.apply(arguments, [1]),
                builder = this.getSandbox().getEventBuilder(eventName),
                evt = builder.apply(builder, args);
            return this.getSandbox().notifyAll(evt);
        },
        /**
         * Hook function for bundle specific op. Called when flyout is opened.
         */
        onOpen : function() {
            this.getSandbox().printDebug('Opened flyout ' + this.getName());
        },

        /**
         * Hook function for bundle specific op. Called when flyout is closed.
         */
        onClose : function() {
            this.getSandbox().printDebug('Closed flyout' + this.getName());
        }

    }, {
        'protocol': ['Oskari.userinterface.Flyout']
    });
