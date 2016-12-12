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
        this._selectedIndex = null;
        this._selected = null;
        this._selection = null;
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
            this._enabled = enabled;
            return undefined;
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
         * @return {Integer} selected index. If not anything selected then return -1
         */
        getValue: function () {
            if(typeof this._selectedIndex === 'undefined') {
                return -1;
            }

            return this._selectedIndex;
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
         */
        setValue: function (value) {
            var me = this;

            me._element.find('.oskari-color-selection .oskari-color-option').css('background-color', '#' + me._colorsConfig.menu).attr('data-selected', false);
            var option = me._element.find('.oskari-color-selection .oskari-color-option[data-index='+value+']');
            var options = me._element.find('.oskari-color-selection .oskari-color-option');
            var optionClone = option.clone();
            if(optionClone.length>0 && value<options.length) {
                optionClone.css('background-color','transparent');
                me._selected.html(optionClone);
                option.attr('data-selected', true);
                option.css('background-color', '#' + me._colorsConfig.selected);
                if(typeof me.getHandler() === 'function') {
                    me.getHandler()(option.attr('data-index'));
                }
                me.close();
                me._selectedIndex = parseFloat(value);
            }
        },

        /**
         * @private @method _getColorTemplate Get color template
         * @param  {Object} colorsDef color defination
         * @return {Object} jQuery color option template
         */
        _getColorTemplate: function(colorsDef){
            var me = this;
            var width = 6, template, i, color, opt;

            if(typeof colorsDef === 'string') {
                opt = me._templates.emptyDiv.clone();
                width = 16;
                template = me._templates.color.clone();
                template.css('background', '#' +colorsDef);
                template.width(width);
                opt.append(template);
                return opt;
            }
            else if (typeof colorsDef === 'object' && colorsDef.length > 0) {
                opt = me._templates.emptyDiv.clone();
                for(i=0;i<colorsDef.length;i++){
                    color = colorsDef[i];
                    template = me._templates.color.clone();
                    template.css('background', '#' +color);
                    template.width(width);
                    opt.append(template);

                }
                return opt;
            }

            return null;
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
        close: function(){
            var me = this;
            me._selected.attr('data-state', 'closed');
            me._selection.hide();
        },

        /**
         * @method  @public setColorValues set colors
         * @param {Object} colors colors array
         */
        setColorValues: function(colors){
            var me = this;

            if(me._selected) {
                me._selected.remove();
                me._selected = null;
            }
            if(me._selection) {
                me._selection.remove();
                me._selection = null;
            }

            me._element.empty();

            if(typeof colors === 'object' && colors.length>0){
                me._selected =  me._templates.selected.clone();
                me._selection = me._templates.selection.clone();

                // Handler for color selection or pressing arrow down
                var selectHandler = function(event){
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
                };

                // Hover in handler
                var hoverIn = function(){
                    me._element.find('.oskari-color-option').css('background-color[data-selected=false]', '#' + me._colorsConfig.menu);
                    var el = jQuery(this);
                    if(el.attr('data-selected') !== 'true' || me._colorsConfig.selected === me._colorsConfig.menu) {
                        el.css('background-color', '#' + me._colorsConfig.hover);
                    }
                };

                // Hover out handler
                var hoverOut = function(){
                    var el = jQuery(this);
                    if(el.attr('data-selected') !== 'true'  || me._colorsConfig.selected === me._colorsConfig.menu) {
                        el.css('background-color', '#' + me._colorsConfig.menu);
                    }
                };

                // Color selection click handler
                var colorClickHandler = function(event){
                    event.stopPropagation();
                    var el = jQuery(this);
                    me.setValue(el.attr('data-index'));
                };

                me._selected.bind('click', selectHandler);

                var colorsDef, colorSel, i;

                for(i=0;i<colors.length;i++){
                    colorsDef = colors[i];
                    colorSel = me._getColorTemplate(colorsDef);
                    if(!colorSel) {
                        continue;
                    }
                    var opt = me._templates.option.clone();
                    opt.css('background-color', '#' + me._colorsConfig.menu);
                    opt.hover(hoverIn, hoverOut);
                    opt.append(colorSel);
                    opt.attr('data-index', i);

                    var width = 6;
                    if(typeof colorsDef === 'string') {
                        width = 16;
                    } else {
                        width = 6 * colorsDef.length;
                    }
                    opt.find('.color').height(16).width(width).css('border', '1px solid #' + me._colorsConfig.colorBorder);

                    opt.append('<div style="clear:both;"></div>');
                    opt.bind('click', colorClickHandler);
                    me._selection.append(opt);
                }

                me._selected.attr('data-state', 'closed');

                var arrow = me._templates.arrow.clone();
                arrow.bind('click', selectHandler);

                var emptyDiv = me._templates.floatNone.clone();

                me._element.append(me._selected);
                me._element.append(arrow);
                me._element.append(emptyDiv);

                me._element.append(me._selection);

                jQuery(document).bind('click', function(){
                    me.close();
                });

                me.close();
            }
        }
}, {
     extend: ['Oskari.userinterface.component.FormComponent']
    }
);