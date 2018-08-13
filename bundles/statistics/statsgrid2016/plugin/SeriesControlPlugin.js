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

        me._mobileDefs = {
            buttons: {
                'mobile-classification': {
                    
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me.log = Oskari.log('Oskari.statistics.statsgrid.SeriesControlPlugin');

        this.__seriesControl = Oskari.clazz.create('Oskari.statistics.statsgrid.SeriesControl', sandbox, this._locale);
    }, {
        _setLayerToolsEditModeImpl: function () {
            if (!this.getElement()) {
                return;
            }
            if (!this.inLayerToolsEditMode()) {
                this.setLocation(
                    this.getElement().parents('.mapplugins').attr(
                        'data-location'
                    )
                );
            }
        },
        _createControlElement: function () {
            if (this.element !== null) {
                return this.element;
            }
            this.element = this._templates.main.clone();
            this.__seriesControl.render(this.element);
            return this.element;
        },
        redrawUI: function (mapInMobileMode, forced) {
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if (!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            if (!toolbarNotReady && mapInMobileMode) {
                // create mobile
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
                return false;
            }
            this.addToPluginContainer(this._createControlElement());
            this._makeDraggable();
            this._enableResize();
            return false;
        },
        teardownUI: function (stopping) {
            var element = this.getElement();
            // detach old element from screen
            if (element) {
                element.detach();
                this.removeFromPluginContainer(element, !stopping);
                this.element = null;
            }
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },
        _makeDraggable: function () {
            this.getElement().prepend('<div class="statsseries-handle oskari-flyoutheading"></div>');
            this.getElement().draggable({
                scroll: false,
                handle: '.statsseries-handle'
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
            resizer.bind('dragstart', function (event) {
                event.preventDefault();
            });

            // Start resizing
            resizer.mousedown(function (e) {
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
            jQuery(document).mouseup(function () {
                me.resizing = false;
                me.resized = true;
            });

            // Resize the control element
            jQuery(document).mousemove(function (e) {
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
                    me.__seriesControl.setWidth(newWidth);
                }
            });
            element.append(resizer);
        },
        getElement: function () {
            return this.element;
        },
        stopPlugin: function () {
            this.teardownUI(true);
        },
        _createEventHandlers: function () {
            return {
                // 'StatsGrid.ActiveIndicatorChangedEvent' : function(evt) {
                // },
                MapSizeChangedEvent: function () {
                }
            };
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
