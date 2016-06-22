/**
 * @class Oskari.statistics.statsgrid.GridModeView
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultView class.
 *
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.GridModeView',
    /**
     * @static constructor function
     */

    function () {}, {
        /**
         * @method getName
         * @return {String} implementation name
         */
        getName: function () {
            return 'Oskari.statistics.statsgrid.GridModeView';
        },
        /**
         * @method startPlugin
         * called by host to start view operations
         */
        startPlugin: function () {
            var me = this,
                sandbox = me.instance.getSandbox();

            var el = me.getEl();
            el.addClass("statsgrid");
        },

        /**
         * Updates the layer, enters/exits the mode and creates the UI
         * to display the indicators selection and the grid.
         *
         * @method prepareMode
         * @param {Boolean} isShown True to enter the mode, false to exit the mode
         */
        prepareMode: function (isShown) {
            var me = this;
            // Do not enter the mode if it's already on.
            if (!me.isVisible || !isShown) {
                me.isVisible = !! isShown;
            }
            if(isShown) {
                this.showMode();
            } else {
                this.closeMode();
            }
            this.showContent(isShown);
        },
        /**
         * Sets the DOM to the mode and updates the map size.
         *
         * @method showMode
         */
        showMode: function () {
            var me = this,
                sandbox = me.instance.getSandbox();
            var elCenter = me.getCenterColumn(),
                elLeft = me.getLeftColumn();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.updateSize();

            jQuery('#contentMap').addClass('statsgrid-contentMap');
            jQuery('.oskariui-mode-content').addClass('statsgrid-mode');
            // TODO we are going to create a handle for grid vs. map separator
            var leftWidth = 40;

            /** show our mode view - view hacks */
            elCenter.removeClass('span12');
            elCenter.width((100 - leftWidth) + '%');
            //window resize is handled in mapfull - instance.js
            elLeft.empty();
            elLeft.show();
            elLeft.removeClass('oskari-closed');
            elLeft.width(leftWidth + '%');
            //elLeft.height(height);
            elLeft.resizable({
                minWidth: 450,
                handles: "e",
                resize: function (event, ui) {
                    elCenter.width(jQuery('.row-fluid').width() - elLeft.width());
                    // TODO: resize table component
                },
                stop: function (event, ui) {
                    var difference = ui.size.width - ui.originalSize.width,
                        tableHeader = jQuery('div.header-columns');
                    // TODO: resize table component
                    //table.width(tableHeader.width() + difference);

                    mapModule.updateSize();
                }
            });
            // make resizehandle visible
            elLeft.find('.ui-resizable-e').css('background-color', '#333438');

            // notify openlayers of map size change
            mapModule.updateSize();
        },
        /** EXIT The Mode */
        closeMode: function () {
            var me = this,
                sandbox = me.instance.getSandbox();
            var elCenter = me.getCenterColumn(),
                elLeft = me.getLeftColumn();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            jQuery('#contentMap').removeClass('statsgrid-contentMap');
            jQuery('.oskariui-mode-content').removeClass('statsgrid-mode');

            // remove width from center-div
            elCenter.width('').addClass('span12');

            elLeft.resizable().resizable('destroy');
            elLeft.addClass('oskari-closed');
            // remove width from left-div
            elLeft.width('');
            elLeft.empty();

            // notify openlayers of map size change
            mapModule.updateSize();
        },
        getLeftColumn: function () {
            return jQuery('.oskariui-left');
        },
        getCenterColumn: function () {
            return jQuery('.oskariui-center');
        },
        getRightColumn: function () {
            return jQuery('.oskariui-right');
        },
        /**
         * @method stopPlugin
         * called by host to stop view operations
         */
        stopPlugin: function () {
        }
    }, {
        "protocol": ["Oskari.userinterface.View"],
        "extend": ["Oskari.userinterface.extension.DefaultView"]
    });
