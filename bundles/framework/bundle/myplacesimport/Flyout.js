/**
 * @class Oskari.mapframework.bundle.myplacesimport.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
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
            iframe: '<iframe id="myplacesimport-target" name="myplacesimport-target" height="0" width="0" frameborder="0" scrolling="no"></iframe>',
            base: '<div class="content">' +
                    '<div class="info"></div>' +
                    '<div class="state"></div>' +
                    '<div class="actions"></div>' +
                '</div>',
            actions: '<div class="import-actions">' +
                    '<input type="button" class="cancel" value="Cancel" />' +
                    '<input type="button" class="next primary" value="Next" />' +
                '</div>',
            file: '<div class="file-import">' +
                    '<form id="myplacesimport-form" method="post" enctype="multipart/form-data" target="myplacesimport-target">' +
                        '<input type="file" name="file-import" multiple></input>' +
                        '<input type="submit" value="Submit" />' +
                    '</form>' +
                '</div>',
            layer: '<div class="layer-info">' +
                    '<div class="name"><label>Name</label><input type="text" name="layer-name" /></div>' +
                    '<div class="desc"><label>Description</label><input type="text" name="layer-desc" /></div>' +
                    '<div class="source"><label>Data source</label><input type="text" name="layer-source" /></div>' +
                '</div>'
        },
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        setTemplate: function(template) {
            this.template = template;
        },
        getTemplate: function() {
            return this.template;
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
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
         * @method stopPlugin
         * Interface method implementation
         */
        stopPlugin: function () {
            if (this.template) this.template.empty();
            this.setTemplate(undefined);
            if (this.container) this.container.empty();
            this.container = undefined;
        },
        refresh: function() {
            this.container
                .find('iframe')
                .replaceWith(jQuery(this.__templates.iframe).clone());

            var template = this.createUi();
            this.getTemplate().replaceWith(template);
            this.setTemplate(template);
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start.
         * Selects the view to show based on user (guest/loggedin)
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
        __createFileImportTemplate: function(locale) {
            var me = this,
                file = jQuery(this.__templates.file).clone(),
                action = this.instance.getService().getFileImportUrl();

            // TODO: set the file upload action route here:
            file.find('form').attr('action', action);
            file.find('form input[type=submit]').val(locale.file.submit);
            // Get to the next step when the action has finished loading.
            this.container.find('iframe').on('load', function() {
                console.log('ifrme loaded');
                me.__layerInfoStep(locale);
            });

            return file;
        },
        __layerInfoStep: function(locale) {
            var template = this.getTemplate();
            template.find('div.info').html(locale.layer.title);
            template.find('div.state').html(this.__createLayerTemplate(locale));
        },
        __createLayerTemplate: function(locale) {
            var layer = jQuery(this.__templates.layer).clone();

            layer.find('div.name label').html(locale.layer.name);
            layer.find('div.desc label').html(locale.layer.desc);
            layer.find('div.source label').html(locale.layer.source);

            layer.append(this.__createActionsTemplate(locale));

            return layer;
        },
        __createActionsTemplate: function(locale) {
            var me = this,
                actions = jQuery(this.__templates.actions).clone();

            actions.find('input.cancel')
                .val(locale.actions.cancel)
                .click(function(e) {
                    me.__cancel();
                });

            actions.find('input.next')
                .val(locale.actions.next)
                .click(function(e) {
                    me.__finish(locale);
                });

            return actions;
        },
        __cancel: function() {
            this.instance.getService().sendImportCleanUp();
            this.refresh();
        },
        __finish: function(locale) {
            var me = this,
                service = this.instance.getService(),
                data = this.__getLayerData();

            service.sendLayerData(data, function(response) {
                // success
                var title = locale.finish.success.title,
                    msg = JSON.stringify(data);

                me.__showMessage(title, msg);
                me.refresh();
            }, function(failure) {
                // failure
            });
        },
        __getLayerData: function() {
            var layerTemplate = this.getTemplate().find('div.layer-info'),
                data = {layer: {}};

            data.layer.name = layerTemplate.find('div.name input').val();
            data.layer.description = layerTemplate.find('div.desc input').val();
            data.layer.source = layerTemplate.find('div.source input').val();

            return data;
        },
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