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

    function (instance) {
        this.instance = instance;
        this.loc = Oskari.getMsg.bind(null, 'MyPlacesImport');
        this.maxFileSize = isNaN(parseInt(this.instance.conf.maxFileSizeMb)) ? 10 : parseInt(this.instance.conf.maxFileSizeMb);
        this.container = undefined;
        this.template = undefined;
        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this.progressBarFile = Oskari.clazz.create('Oskari.userinterface.component.ProgressBar');
        this.fileInput = null;
        this.styleForm = Oskari.clazz.create('Oskari.userinterface.component.VisualizationForm');
    }, {
        __name: 'Oskari.mapframework.bundle.myplacesimport.Flyout',
        __templates: {
            base: '<div class="content">' +
                    '<div class="info"></div>' +
                    '<div class="state"></div>' +
                '</div>',
            help: '<div class="help icon-info"></div>',
            file: '<div class="file-import">' +
                    '<form id="myplacesimport-form" enctype="multipart/form-data">' +
                        '<div class="file-input-container"></div>' +
                        '<div class="name"><label>Name</label><input type="text" name="layer-name" /></div>' +
                        '<div class="desc"><label>Description</label><input type="text" name="layer-desc" /></div>' +
                        '<div class="source"><label>Data source</label><input type="text" name="layer-source" /></div>' +
                        '<div class="style">' +
                            '<label>Layer style</label>' +
                            '<div class="style-form"></div>' +
                        '</div>' +
                        '<input type="button" class="primary" />' +
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
        setTemplate: function (template) {
            if (this.template && template) {
                this.template.replaceWith(template);
            }
            this.template = template;
        },
        /**
         * @method getTemplate
         * @return {jQuery}
         */
        getTemplate: function () {
            return this.template;
        },
        /**
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         *
         * @method startPlugin
         */
        startPlugin: function () {
            var container = this.getEl();
            container.addClass('myplacesimport');
            var tooltipCont = jQuery(this.__templates.help).clone();
            tooltipCont.attr('title', this.loc('flyout.help'));
            container.append(tooltipCont);

            this.fileInput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', {
                'allowMultipleFiles': false,
                'maxFileSize': parseInt(this.instance.conf.maxFileSizeMb),
                'allowedFileTypes': ['application/zip', 'application/octet-stream', 'application/x-zip-compressed', 'multipart/x-zip'],
                'inputName': 'file-import',
                'allowedFileExtensions': ['zip']
            });

            this.setTemplate(this.createUi());
            container.append(this.getTemplate());
            this.bindListeners();
            /* progress */
            this.progressSpinner.insertTo(container);
            this.progressBarFile.create(container);
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
        refresh: function () {
            this.setTemplate(this.createUi());
            this.bindListeners();
        },
        /**
         * Creates the UI for a fresh start.
         *
         * @method createUi
         * @return {jQuery} returns the template to place on the DOM
         */
        createUi: function () {
            var template = jQuery(this.__templates.base).clone();
            template.find('div.info')
                .html(this.loc('flyout.description', {maxSize: this.maxFileSize}));
            template.find('div.state')
                .html(this.__createFileImportTemplate());
            return template;
        },
        bindListeners: function () {
            var btn = this.container.find('form input[type=button]');
            this.fileInput.on('file-input', function (hasFile) {
                if (hasFile) {
                    btn.prop('disabled', false);
                } else {
                    btn.prop('disabled', true);
                }
            });
        },
        /**
         * Creates the template for file upload form
         *
         * @method __createFileImportTemplate
         * @private
         * @param  {Object} locale
         * @return {jQuery}
         */
        __createFileImportTemplate: function () {
            var me = this;
            var file = jQuery(this.__templates.file).clone();
            file.find('.file-input-container').append(this.fileInput.getElement());
            file.find('div.name label').html(this.loc('flyout.layer.name'));
            file.find('div.desc label').html(this.loc('flyout.layer.desc'));
            file.find('div.source label').html(this.loc('flyout.layer.source'));
            file.find('div.style label').html(this.loc('flyout.layer.style'));
            file.find('div.style-form').html(this.styleForm.getForm());
            file.find('input[type=button]').val(this.loc('flyout.actions.submit'));

            file.find('input[type=button]').on('click', function (e) {
                var form = file.find('form');
                // Prevent from sending if there were missing fields
                if (!me.__validateForm(form)) {
                    return;
                }
                me.submitUserLayer(form);
            });
            return file;
        },
        submitUserLayer: function (form) {
            var me = this;
            var formData = new FormData(form[0]);
            formData.append('layer-style', JSON.stringify(me.__getStyleValues()));

            jQuery.ajax({
                url: me.instance.getService().getFileImportUrl(),
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false, // 'multipart/form-data',
                processData: false,
                dataType: 'json',
                xhr: function () {
                    var myXhr = jQuery.ajaxSettings.xhr();// new XMLHttpRequest()
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('loadstart', function (e) {
                            me.progressSpinner.start();
                        });
                        myXhr.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                me.progressBarFile.show();
                                me.progressBarFile.updateProgressBar(e.total, e.loaded);
                            }
                        });
                    }
                    return myXhr;
                },
                success: function (data, textStatus, jqXHR) {
                    me.__finish(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    me.__error(jqXHR);
                }
            });
        },
        /**
         * Returns the visualization form's values.
         *
         * @method __getStyleValues
         * @private
         * @return {Object}
         */
        __getStyleValues: function () {
            var formValues = this.styleForm.getValues();
            var values = {};

            if (formValues) {
                values.dot = {
                    size: formValues.dot.size,
                    color: formValues.dot.color,
                    shape: formValues.dot.shape
                };
                values.line = {
                    width: formValues.line.width,
                    color: formValues.line.color,
                    cap: formValues.line.cap,
                    corner: formValues.line.corner,
                    style: formValues.line.style
                };
                values.area = {
                    lineWidth: formValues.area.lineWidth,
                    lineColor: formValues.area.lineColor === null ? null : formValues.area.lineColor,
                    fillColor: formValues.area.fillColor === null ? null : formValues.area.fillColor,
                    lineStyle: formValues.area.lineStyle,
                    fillStyle: formValues.area.fillStyle,
                    lineCorner: formValues.area.lineCorner
                };
            }
            return values;
        },
        /**
         * Validates the form inputs (currently that the name and file are present).
         * Returns false if there were any errors (missing values).
         *
         * @method __validateForm
         * @private
         * @param  {jQuery} form
         * @return {Boolean}
         */
        __validateForm: function (form) {
            var nameInput = form.find('input[name=layer-name]');
            var errors = [];
            if (!nameInput.val()) {
                errors.push(this.loc('flyout.validations.error.name'));
            }
            if (!this.fileInput.hasFiles()) {
                errors.push(this.loc('flyout.validations.error.file'));
            }
            if (errors.length === 0) {
                return true;
            }
            var errorTitle = this.loc('flyout.validations.error.title');
            this.__showMessage(errorTitle, errors);
            return false;
        },
        /**
         * Shows a message on success.
         * Also refreshes the UI
         *
         * @method __finish
         * @private
         * @param {Object} json
         * @param {Object} locale
         */
        __finish: function (json) {
            this.progressSpinner.stop();
            var title = this.loc('flyout.finish.success.title');
            var msg = this.loc('flyout.finish.success.message', {count: json.featuresCount});
            var fadeout = true;

            if (json.warning !== undefined && json.warning.featuresSkipped) {
                msg = msg + ' ' + this.loc('flyout.warning.features_skipped', {count: json.warning.featuresSkipped});
                fadeout = false;
            }
            this.instance.addUserLayer(json);
            this.__showMessage(title, msg, fadeout);
            this.refresh();
        },
        __error: function (response) {
            this.progressSpinner.stop();
            var json = response.responseJSON;
            var title = this.loc('flyout.finish.failure.title'); // error.title??
            var errors = this.loc('flyout.error');
            var msg = errors.generic;
            // TODO response.status === 404
            if (!json.info) {
                this.__showMessage(title, msg, false);
                Oskari.log('MyPlacesImport').error('Error message:', json.error);
                return;
            }
            var errorCode = json.info.error;
            switch (errorCode) {
            case 'multiple_extensions':
                msg = this.loc('flyout.error.multiple_extensions', {extension: json.info.extension});
                break;
            case 'no_features':
                break;
            case 'file_over_size':
                msg = this.loc('flyout.error.file_over_size', {maxSize: this.maxFileSize});
                break;
            case 'invalid_file':
                msg = this.loc('flyout.error.invalid_file');
                // TODO has folders, no zip
                break;
            case 'parser_error':
                msg = [];
                msg.push(errors.parsererror);
                msg.push(errors[json.info.parser]);
            default:
                if (errors[errorCode]) {
                    msg = errors[errorCode];
                }
            }
            this.__showMessage(title, msg, false);
        },

        /**
         * Displays a message on the screen
         *
         * @method __showMessage
         * @private
         * @param  {String} title
         * @param  {String} message
         * @param  {boolean} fadeout
         */
        __showMessage: function (title, message, fadeout, list) {
            fadeout = fadeout !== false;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var btn = dialog.createCloseButton(this.loc('flyout.actions.close'));
            var content;
            if (Array.isArray(message)) { // TODO
                content = message.join('<br>');
            } else {
                content = message;
            }
            if (Array.isArray(list)) {
                content += '<ul><li>' + list.join('</li><li>') + '</li></ul>';
            }
            dialog.makeModal();
            dialog.show(title, content, [btn]);
            if (fadeout) {
                dialog.fadeout(5000);
            }
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });
