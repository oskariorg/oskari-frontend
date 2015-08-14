/**
 * @class Oskari.mapframework.bundle.parcel.view.ParcelPrintForm2
 * 
 * Shows a form for my place. For requests for name and description.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.view.ParcelPrintForm2",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.initialValues = undefined;
    this._formUi = undefined;
    this.isEnabled = false;
    this.pointCnt = 0;
    
    this.loc = instance.getLocalization('parcelprintform2');

    this.template = jQuery('<div class="parcelprintform2">' +
        '<div class="header">' +
        '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">'+
        '<div class="field">' +
        '<div class="help icon-question" ' +
        'title="' + this.loc.tooltip + '"></div>' +
        '<div class="pointlist"></div>' +
        '<div class="buttons"></div>' +
        '</div></div>');
    this.pl_template = jQuery(
        '<div class="field">' +
            '<label></label>' +
            '<textarea name="pointx" class="with_placeholder" placeholder="' + this.loc.point.placeholder + '">' +
            '</textarea>' +
            '</div>');
    this.pl_template2 = jQuery(
        '<div class="field">' +
            '<label></label>' +
            '<textarea name="pointx">' +
            '</textarea>' +
            '</div>');

}, {

        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container, mainview) {
            var me = this;
            var content = me._getForm();

            this.mainPanel = content;
            content.find('div.header h3').append(me.loc.title);

            container.append(content);


            // buttons
            container.find('div.header div.icon-close').bind('click', function () {
                me.instance.setParcelPrintBreak();
            });
            //Break
            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');

            cancelButton.setTitle(me.loc.buttons['break']);
            cancelButton.setHandler(function () {
                me.instance.setParcelPrintBreak();
            });

            cancelButton.insertTo(content.find('div.buttons'));
            //Previous
            var previousButton = Oskari.clazz.create('Oskari.userinterface.component.Button');

            previousButton.setTitle(me.loc.buttons['previous']);
            previousButton.setHandler(function () {
                me.instance.setParcelPrintPrevious();
            });

            previousButton.insertTo(content.find('div.buttons'));

            //Continue
            var continueButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            continueButton.addClass('primary');
            continueButton.setTitle(me.loc.buttons['continue']);
            continueButton.setHandler(function () {
                me.instance.requestParcelPrintFinal();
            });
            continueButton.insertTo(content.find('div.buttons'));


            var inputs = me._formUi.find('input[type=text]');
            inputs.focus(function () {
                me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            });
            inputs.blur(function () {
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });

            //IE 10 fix
            jQuery('textarea.with_placeholder').focus(function() {
                if (me.loc.point.placeholder === this.value) {
                    this.value = '';
                }
            }).blur(function(){
                if (this.value === '') {
                    this.attr("placeholder",me.loc.point.placeholder);
                }
            });
        },
        /**
         *
         * @param mainview
         */
        refreshData: function (mainview) {
            var new_points_cnt = this.instance.getDrawPlugin().getNewPointsCount();
            if(this.pointCnt !== new_points_cnt)
            {
                this._formUi.find('div.pointlist').empty();
                for (i = 1; i < new_points_cnt + 1 ; i++) {
                    if (i === 1) plui = this.pl_template.clone();
                    else plui = this.pl_template2.clone();
                    plui.find('label').append(this.loc.point.label+" "+i);
                    plui.find('textarea').attr("name","pnro_"+i);

                    this._formUi.find('div.pointlist').append(plui);
                }
                this.pointCnt = new_points_cnt;
            }

        },
            /**
     * @method getForm
     * @return {jQuery} jquery reference for the form 
     */
        _getForm: function () {
                var ui = this.template.clone(),
                    plui = undefined,
                    i;

                var new_points_cnt = this.instance.getDrawPlugin().getNewPointsCount();
                for (i = 1; i < new_points_cnt + 1 ; i++) {
                    if (i === 1) plui = this.pl_template.clone();
                    else plui = this.pl_template2.clone();
                    plui.find('label').append(this.loc.point.label+" "+i);
                    plui.find('textarea').attr("name","Pnro "+i);

                    ui.find('div.pointlist').append(plui);
                }
                this.pointCnt = new_points_cnt;
                this._formUi = ui;
                return ui;
            },
    /**
     * @method getValues
     * Returns form values as an object
     * @return {Object} 
     */
    getValues : function() {
        var values = [],
            table = {},
            titlerow = {};

        // infobox will make us lose our reference so search 
        // from document using the form-class
        var onScreenForm = this._getOnScreenForm();

        if (onScreenForm.length > 0) {

            titlerow.col1 = this.loc.pointnumber;
            titlerow.col2 = this.loc.pointdesc;
            values.push(titlerow);

            // Loop boundary point descriptions
            jQuery('textarea').each(function(index) {
                var pnodata = {};
                pnodata.col1 = jQuery(this).attr('name');
                pnodata.col2 = jQuery(this).val();
                if (pnodata.col2 !== "") values.push(pnodata);
            });

            table.table1 = values;

        }
        return table;
    },

    /**
     * @method _getOnScreenForm
     * Returns reference to the on screen version shown by OpenLayers 
     * @private
     */
    _getOnScreenForm : function() {
        // unbind live so 
        return jQuery('div.parcelprintform1');
    },
        /**
         * @method destroy
         * Destroyes/removes this view from the screen.
         */
        destroy: function () {
            // unbind live bindings
            var onScreenForm = this._getOnScreenForm();
            this._formUi.remove();
        },
        hide: function () {
            this._formUi.hide();
        },
        show: function () {
            this._formUi.show();
        },
        setEnabled: function (e) {
            this.isEnabled = e;
        },
        getEnabled: function () {
            return this.isEnabled;
        }
});
