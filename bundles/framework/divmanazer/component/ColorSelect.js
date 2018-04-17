/**
 * @class Oskari.userinterface.component.ColorSelect
 *
 * Simple ColorSelect component.
 *
 * If not set any color then returning empty div.
 */
Oskari.clazz.define('Oskari.userinterface.component.ColorSelect',

    /**
     * @method create called automatically on construction
     */
    function () {
        this._colorsConfig = {
            hover: '306BC8',
            selected: 'FFFFFF',
            menu: 'FFFFFF',
            colorBorder: '555555'
        };

        this._templates = {
            main: jQuery('<div class="oskari-color-selection-main"></div>'),
            selected: jQuery('<div class="oskari-selected-color"></div>'),
            arrow: jQuery('<div class="color-selection-arrow"><div class="icon-arrow-down"></div></div>'),
            floatNone: jQuery('<div style="clear:both;"></div>'),
            selection: jQuery('<div class="oskari-color-selection"></div>'),
            option: jQuery('<div class="oskari-color-option"></div>'),
            color: jQuery('<div class="oskari-color"></div>'),
            emptyDiv: jQuery('<div class="color"></div>')
        };

        this._clazz = 'Oskari.userinterface.component.ColorSelect';
        this._enabled = true;
        this._handler = null;
        this._name = null;
        this._required = false;
        this._title = null;
        this._tooltip = null;
        this._visible = true;
        this._element = this._templates.main.clone();
        this._selectedValue = null;
        this._selected = null;
        this._selection = null;

        var me = this;
        jQuery(document).on('click', function () {
            me.close();
        });
    }, {
        /**
         * @method @private _destroyImpl
         * Called before component element is removed. Useful for cleanup.
         */
        _destroyImpl: function () {
            this.close();
            return undefined;
        },

        /**
         * @method @private _setEnabledImpl
         * @param {Boolean} enabled
         *     Implement if the component can actually be disabled.
         */
        _setEnabledImpl: function (enabled) {
            var me = this;
            me._enabled = enabled;

            if (enabled) {
                me._element.removeClass('disabled');
            } else {
                me._element.addClass('disabled');
            }

            return enabled;
        },

        /**
         * @method @public isEnabled
         *     Override if the component can actually be disabled.
         * @return {Boolean} enabled
         */
        isEnabled: function () {
            return this.enabled;
        },

        /**
         * @method @public getValue
         * @return {Integer|String} selected value
         */
        getValue: function () {
            return this._selectedValue;
        },

        /**
         * @method  @public setUIColors set custom colors for ui
         * @param {Object} config color config
         */
        setUIColors: function(config){
            var me = this;
            me._colorsConfig = jQuery.extend({}, me._colorsConfig, config);
        },

        /**
         * @method @public setValue
         * Sets the component's value. Value ie wanted index color value.
         * @param {Integer} value
         * @param {Boolean} silent if true -> don't call handler method
         * @param {Boolean} defaultToFirst if true and requested value is not found -> use the first option as value
         */
        setValue: function (value, silent, defaultToFirst) {
            var me = this;
            me._element.find('.oskari-color-selection .oskari-color-option').css('background-color', '#' + me._colorsConfig.menu).attr('data-selected', false);
            var option = me._element.find('.oskari-color-selection .oskari-color-option[data-id='+value+']');
            var options = me._element.find('.oskari-color-selection .oskari-color-option');
            var optionClone = option.clone();
            if(!optionClone.length && defaultToFirst) {
                optionClone= jQuery(options[0]).clone();
            }
            if(optionClone.length>0) {
                me._selectedValue = value;
                optionClone.css('background-color','transparent');
                me._selected.html(optionClone);
                option.attr('data-selected', true);
                option.css('background-color', '#' + me._colorsConfig.selected);
                if(!silent && typeof me.getHandler() === 'function') {
                    me.getHandler()(option.attr('data-id'));
                }
                me.close();
            }

            me._setHandlers();
        },

        refresh: function(){
            var me = this;
            me._setHandlers();
        },

        _setHandlers: function(){
            var me = this;

            if(!me._selected){
                return;
            }
            var handlers = me._handlers();

            me._selected.unbind('click');
            me._selected.bind('click', handlers.selectHandler);
            var options = me._selection.find('.oskari-color-option');
            options.unbind('click');
            options.bind('click', handlers.colorClickHandler);
            options.hover(handlers.hoverIn, handlers.hoverOut);

            me._element.find('.color-selection-arrow').unbind('click');
            me._element.find('.color-selection-arrow').bind('click', handlers.selectHandler);
        },


        /**
         * @private @method _getColorTemplate Get color template
         * @param  {Object} colorsDef color defination
         * @return {Object} jQuery color option template
         */
        _getColorTemplate: function(colorsDef, width){
            var me = this;
            if(colorsDef === null) {
                return;
            }
            if(typeof colorsDef === 'string') {
                // plain string - wrap to array and change width
                return this._getColorTemplate([colorsDef], 16);
            }
            if (!colorsDef || typeof colorsDef.forEach !== 'function') {
                // not an array
                return;
            }
            var opt = me._templates.emptyDiv.clone();
            colorsDef.forEach(function(color) {
                var template = me._templates.color.clone();
                template.css('background', '#' + color);
                template.width(width || 6);
                opt.append(template);
            });
            return opt;
        },

        /**
         * @public @method open open selection
         */
        open: function(){
            var me = this;
            if(me._enabled) {
                me._selected.attr('data-state', 'opened');
                me._selection.show();
            }
        },

        /**
         * @public close close selection
         */
        close: function () {
            var me = this;
            if (!me._selected) {
                // not rendered yet
                return;
            }
            me._selected.attr('data-state', 'closed');
            me._selection.hide();
        },

        _handlers: function() {
            var me = this;
            return {
                // Handler for color selection or pressing arrow down
                selectHandler: function(event){
                    event.stopPropagation();
                    var arrow = me._element.find('.color-selection-arrow');
                    if(me._selected.attr('data-state') === 'closed') {
                        var posTop = me._selected.position().top + me._selected.outerHeight();
                        var posLeft = me._selected.position().left;
                        me._selection.css({
                            'top': posTop + 'px',
                            'left': posLeft + 'px',
                            'width': (me._selected.outerWidth() + arrow.outerWidth() - 2) + 'px'
                        });
                        me.open();
                    }
                    else if(me._selected.attr('data-state') === 'opened') {
                        me.close();
                    }
                },
                // Color selection click handler
                colorClickHandler: function(event){
                    event.stopPropagation();
                    var el = jQuery(this);
                    me.setValue(el.attr('data-id'));
                },
                // Hover in handler
                hoverIn: function(){
                    me._element.find('.oskari-color-option').css('background-color[data-selected=false]', '#' + me._colorsConfig.menu);
                    var el = jQuery(this);
                    if(el.attr('data-selected') !== 'true' || me._colorsConfig.selected === me._colorsConfig.menu) {
                        el.css('background-color', '#' + me._colorsConfig.hover);
                    }
                },
                // Hover out handler
                hoverOut: function(){
                    var el = jQuery(this);
                    if(el.attr('data-selected') !== 'true'  || me._colorsConfig.selected === me._colorsConfig.menu) {
                        el.css('background-color', '#' + me._colorsConfig.menu);
                    }
                }
            };
        },

        /**
         * @method  @public setColorValues set colors
         * @param {Object} colors colors array
         */
        setColorValues: function (colors) {
            var me = this;

            if(me._selected) {
                me._selected.empty();
            } else {
                me._selected =  me._templates.selected.clone();
            }
            if(me._selection) {
                me._selection.empty();
            } else {
                me._selection = me._templates.selection.clone();
            }

            me._element.empty();

            if (typeof colors !== 'object' || !colors.length) {
                // not an array
                return;
            }
            me._selection.hide();

            colors.forEach(function (colorsDef, index) {
                // colorsDef can be like '#FFFFFF', ['#FFFFFF'] or { id : <myid>, value : ['#FFFFFF']}
                var colorset = colorsDef.value || colorsDef;
                var colorSel = me._getColorTemplate(colorset);
                if (!colorSel) {
                    return;
                }
                var opt = me._templates.option.clone();
                opt.css('background-color', '#' + me._colorsConfig.menu);
                opt.append(colorSel);
                opt.attr('data-id', colorsDef.id || index);

                var width = 6;
                if (typeof colorset === 'string') {
                    width = 16;
                } else {
                    width = 6 * colorset.length;
                }
                opt.find('.color').height(16).width(width).css('border', '1px solid #' + me._colorsConfig.colorBorder);

                opt.append('<div style="clear:both;"></div>');
                me._selection.append(opt);
            });

            me._selected.attr('data-state', 'closed');

            var arrow = me._templates.arrow.clone();
            var emptyDiv = me._templates.floatNone.clone();

            me._element.append(me._selected);
            me._element.append(arrow);
            me._element.append(emptyDiv);

            me._element.append(me._selection);

            me._setHandlers();

            me.close();
        },
        /**
         * @method _setVisibleImpl
         * @param {Boolean} visible
         */
        _setVisibleImpl: function (visible) {
            var me = this;
            me._visible = visible;
            if (visible) {
                me._element.show();
            } else {
                me._element.hide();
            }
            return visible;
        }
}, {
    extend: ['Oskari.userinterface.component.FormComponent']
    }
);