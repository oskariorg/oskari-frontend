/**
 * @class Oskari.mapframework.bundle.myplacesimport.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance} instance
     *      reference to component that created the flyout
     */

    function (instance, locale) {
        this.instance = instance;
        this.locale = locale;
        this.container = undefined;
        this.template = undefined;
    }, {
        __name: 'Oskari.mapframework.bundle.myplacesimport.Flyout',
        __templates: {
            iframe: '<iframe src="JavaScript:\"\"" id="myplacesimport-target" name="myplacesimport-target" height="0" width="0" frameborder="0" scrolling="no"></iframe>',
            base: '<div class="content">' +
                    '<div class="info"></div>' +
                    '<div class="state"></div>' +
                '</div>',
            file: '<div class="file-import">' +
                    '<form id="myplacesimport-form" method="post" enctype="multipart/form-data" target="myplacesimport-target">' +
                        '<input type="file" name="file-import"></input>' +
                        '<div class="name"><label>Name</label><input type="text" name="layer-name" /></div>' +
                        '<div class="desc"><label>Description</label><input type="text" name="layer-desc" /></div>' +
                        '<div class="source"><label>Data source</label><input type="text" name="layer-source" /></div>' +
                        '<input type="submit" value="Submit" class="primary" />' +
                    '</form>' +
                '</div>'
        },
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method setTemplate
         * @param {jQuery} template
         */
        setTemplate: function(template) {
            if (this.template && template) {
                this.template.replaceWith(template);
            }
            this.template = template;
        },
        /**
         * @method getTemplate
         * @return {jQuery}
         */
        getTemplate: function() {
            return this.template;
        },
        /**
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         *
         * @method startPlugin
         */
        startPlugin: function () {
            var container = this.getEl(),
                iframe = jQuery(this.__templates.iframe).clone();

            container.addClass('myplacesimport');
            container.append(iframe);

            this.setTemplate(this.createUi());
            container.append(this.getTemplate());
        },
        /**
         * Interface method implementation
         *
         * @method stopPlugin
         */
        stopPlugin: function () {
            if (this.template) this.template.empty();
            this.setTemplate(undefined);
            if (this.container) this.container.empty();
            this.container = undefined;
        },
        /**
         * Creates a new UI from scratch
         *
         * @method refresh
         */
        refresh: function() {
            this.container
                .find('iframe')
                .replaceWith(jQuery(this.__templates.iframe).clone());

            this.setTemplate(this.createUi());
        },
        /**
         * Creates the UI for a fresh start.
         *
         * @method createUi
         * @return {jQuery} returns the template to place on the DOM
         */
        createUi: function () {
            var locale = this.getLocalization(),
                template = jQuery(this.__templates.base).clone();

            template.find('div.info')
                .html(locale.description);
            template.find('div.state')
                .html(this.__createFileImportTemplate(locale));

            return template;
        },
        /**
         * Creates the template for file upload form
         *
         * @method __createFileImportTemplate
         * @private
         * @param  {Object} locale
         * @return {jQuery}
         */
        __createFileImportTemplate: function(locale) {
            var me = this,
                file = jQuery(this.__templates.file).clone(),
                action = this.instance.getService().getFileImportUrl();

            file.find('form')
                .attr('action', action);
            file.find('form input[type=submit]')
                .val(locale.file.submit);
            file.find('div.name label')
                .html(locale.layer.name);
            file.find('div.desc label')
                .html(locale.layer.desc);
            file.find('div.source label')
                .html(locale.layer.source);
            this.container.find('iframe').on('load', function() {
                me.__finish(locale);
            });

            return file;
        },
        /**
         * Sends the layer data to the backend and shows a message.
         * Also refreshes the UI
         * 
         * @method __finish
         * @private
         * @param  {Object} locale
         */
        __finish: function(locale) {
            // TODO: somehow get the layer json from the iframe
            // and display the layer on the map and in the my data menu
            var title = locale.finish.success.title,
                msg = locale.finish.success.message;

            this.__showMessage(title, msg);
            this.refresh();
        },
        /**
         * Displays a message on the screen
         * 
         * @method __showMessage
         * @private
         * @param  {String} title
         * @param  {String} message
         */
        __showMessage: function (title, message) {
            var me = this,
                loc = this._locale,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            
            dialog.show(title, message);
            dialog.fadeout(5000);
        },
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });