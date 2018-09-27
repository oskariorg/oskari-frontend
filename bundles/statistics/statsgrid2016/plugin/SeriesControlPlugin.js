/**
 * @class Oskari.statistics.statsgrid.SeriesControlPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.SeriesControlPlugin',

    function (instance, config, locale, sandbox) {
        var me = this;
        me._locale = locale;
        me._config = config || {};
        me._sandbox = sandbox;
        me._instance = instance;
        me._clazz = 'Oskari.statistics.statsgrid.SeriesControlPlugin';
        me._defaultLocation = 'center top';
        me._index = 5;

        me._name = 'SeriesControlPlugin';
        me.element = null;
        me._templates = {
            main: jQuery('<div class="mapplugin statsgrid-series-control-plugin"></div>')
        };

        me._isMobileVisible = true;

        me._mobileDefs = {
            buttons: {
                'mobile-stats-series': {
                    iconCls: 'mobile-timeseries',
                    tooltip: '',
                    sticky: false,
                    show: true,
                    callback: function () {
                        if (me._isMobileVisible) {
                            me.teardownUI();
                        } else {
                            me._buildUI();
                        }
                    }
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me.log = Oskari.log('Oskari.statistics.statsgrid.SeriesControlPlugin');

        me._seriesControl = Oskari.clazz.create('Oskari.statistics.statsgrid.SeriesControl', sandbox, this._locale);
    }, {
        redrawUI: function (mapInMobileMode, forced) {
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarReady = !this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && !toolbarReady) {
                return true;
            }
            this.teardownUI();

            if (toolbarReady && mapInMobileMode) {
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
                var toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')('mobile-stats-series', 'mobileToolbar-mobile-toolbar');
                this.getSandbox().request(this, toolbarRequest);
            }
            if (!mapInMobileMode) {
                this._buildUI();
            }
            return false;
        },
        teardownUI: function () {
            this._isMobileVisible = false;
            if (this.element) {
                this.removeFromPluginContainer(this.getElement());
                this.element = null;
            }
        },
        _buildUI: function () {
            this._isMobileVisible = true;
            this.addToPluginContainer(this._createControlElement());
            this._makeDraggable();
            this._enableResize();
        },
        _createControlElement: function () {
            if (this.element !== null) {
                return this.element;
            }
            this.element = this._templates.main.clone();
            this._seriesControl.render(this.element);
            return this.element;
        },
        _makeDraggable: function () {
            this.getElement().prepend('<div class="stats-series-handle oskari-flyoutheading"></div>');
            this.getElement().draggable({
                scroll: false,
                handle: '.stats-series-handle'
            });
        },
        /**
         * @method _enableResize
         * Enables the flyout resizing
         */
        _enableResize: function () {
            var me = this;
            var element = me._element;
            var mouseOffsetX = 0;

            // Resizer image for lower right corner
            var resizer = jQuery('<div/>');
            resizer.addClass('flyout-resizer');
            resizer.removeClass('allowHover');
            resizer.addClass('icon-drag');
            resizer.on('dragstart', function (event) {
                event.preventDefault();
            });

            // Start resizing
            resizer.on('mousedown', function (e) {
                if (me.resizing) {
                    return;
                }
                me.resizing = true;
                var elemOffset = element.offset();
                mouseOffsetX = e.pageX - element[0].offsetWidth - elemOffset.left;
                // Disable mouse selecting
                jQuery(document).attr('unselectable', 'on')
                    .css('user-select', 'none')
                    .on('selectstart', false);
            });

            // End resizing
            jQuery(document).on('mouseup', function () {
                me.resizing = false;
                me.resized = true;
            });

            // Resize the control element
            jQuery(document).on('mousemove', function (e) {
                if (!me.resizing) {
                    return;
                }

                var element = me._element;
                var position = element.offset();
                var minWidth = 290;

                if (e.pageX > position.left + minWidth) {
                    var newWidth = e.pageX - position.left - mouseOffsetX;
                    element.css('max-width', newWidth.toString() + 'px');
                    element.css('width', newWidth.toString() + 'px');
                    me._seriesControl.setWidth(newWidth);
                }
            });
            element.append(resizer);
        },
        getElement: function () {
            return this.element;
        },
        stopPlugin: function () {
            this.teardownUI();
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
