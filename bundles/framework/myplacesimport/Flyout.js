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
        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this.progressBarFile = Oskari.clazz.create('Oskari.userinterface.component.ProgressBar');
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
                        '<div class="file-import"><input type="file" name="file-import" accept="application/zip"></input></div>' +
                        '<div class="name"><label>Name</label><input type="text" name="layer-name" /></div>' +
                        '<div class="desc"><label>Description</label><input type="text" name="layer-desc" /></div>' +
                        '<div class="source"><label>Data source</label><input type="text" name="layer-source" /></div>' +
                        '<div class="style">' +
                            '<label>Layer style</label>' +
                            '<div class="style-form"></div>' +
                            '<input type="hidden" name="layer-style" />' +
                        '</div>' +
                        '<input type="button" value="Submit" class="primary" />' +
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
            var container = this.getEl(),
                tooltipCont = jQuery(this.__templates.help).clone();
            container.addClass('myplacesimport');
            tooltipCont.attr('title', this.locale.help);
            container.append(tooltipCont);

            this.setTemplate(this.createUi());
            container.append(this.getTemplate());
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
                .html(locale.description.replace(/<xx>/g, this.instance.conf.maxFileSizeMb));
            template.find('div.state')
                .html(this.__createFileImportTemplate(locale));

            return template;
        },
        /**
        * Checks the file upload form file size
        * @private
        */
        /*
        __checkFileSize: function(locale){
            var me = this,
                maxFileSizeMb = me.instance.conf.maxFileSizeMb,
                fileSize = null,
                fileInput = me.container.find('input[name=file-import]');

            // Checks modern browsers (FF, Safari, Opera, Chore and IE 10 >)
            if(fileInput[0]  && fileInput[0].files) {
                fileSize = fileInput[0].files[0].size //size in kb
                fileSize = fileSize / 1048576; //size in mb
            }

            // Check IE 9
            if(fileSize===null && navigator.userAgent.match(/msie/i)) {
                try{
                    var hasAX = "ActiveXObject" in window;
                    if(hasAX){
                        var objFSO = new ActiveXObject("Scripting.FileSystemObject");
                        var filePath = jQuery("#" + fileid)[0].value;
                        var objFile = objFSO.getFile(filePath);
                        var fileSize = objFile.size; //size in kb
                        fileSize = fileSize / 1048576; //size in mb
                    }
                } catch(e){
                    // ActiveX not supported, please check at it's enabled
                    // If ActiveX not enabled, check file size on backend code.
                }
            }

            if(fileSize!==null && fileSize>maxFileSizeMb) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    btn = dialog.createCloseButton(locale.file.fileOverSizeError.close);
                dialog.show(locale.file.fileOverSizeError.title, locale.file.fileOverSizeError.message.replace(/<xx>/g, maxFileSizeMb), [btn]);
                dialog.makeModal();
                dialog.onClose(function() {
                    me.container.find('form input[type=submit]').prop('disabled', true);
                });
            } else {
                me.container.find('form input[type=submit]').prop('disabled', false);
            }

        }, */
        /**
         * Creates the template for file upload form
         *
         * @method __createFileImportTemplate
         * @private
         * @param  {Object} locale
         * @return {jQuery}
         */
        __createFileImportTemplate: function (locale) {
            var me = this,
                file = jQuery(this.__templates.file).clone(),
                action = this.instance.getService().getFileImportUrl(),
                styleForm = Oskari.clazz.create(
                    'Oskari.userinterface.component.VisualizationForm'
                );

            file.find('div.name label').html(locale.layer.name);
            file.find('div.desc label').html(locale.layer.desc);
            file.find('div.source label').html(locale.layer.source);
            file.find('div.style label').html(locale.layer.style);
            file.find('div.style-form').html(styleForm.getForm());
            file.find('input[type=button]').val(locale.file.submit);

            file.find('input[name=file-import]').on('change', function (e) {
                var file = this.files[0],
                    maxFileSizeMb = me.instance.conf.maxFileSizeMb;
                if ((file.size / 1048576) > maxFileSizeMb) { // size in mb
                    me.container.find('form input[type=button]').prop('disabled', true);
                    me.__showMessage(locale.file.fileOverSizeError.title, locale.file.fileOverSizeError.message.replace(/<xx>/g, maxFileSizeMb), false);
                } else {
                    me.container.find('form input[type=button]').prop('disabled', false);
                }
            });

            file.find('input[type=button]').on('click', function (e) {
                var styleJson = JSON.stringify(me.__getStyleValues(styleForm)),
                    form = file.find('form'); // jQuery(this).parent()
                // Set the value of the hidden style field
                form.find('input[name=layer-style]').val(styleJson);
                // Prevent from sending if there were missing fields
                if (me.__validateForm(form, locale)) {
                    return; // e.preventDefault()
                }

                jQuery.ajax({
                    url: action,
                    type: 'POST',
                    data: new FormData(form[0]),
                    cache: false,
                    contentType: false, // multipart/form-data
                    processData: false,
                    // timeout : ,
                    // dataType: 'json',
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
                        me.progressSpinner.stop();
                        me.__finish(data, locale);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var msg = null,
                            title = locale.finish.failure.title,
                            error = null,
                            warning = null,
                            err;
                        me.progressSpinner.stop();
                        if (textStatus === 'error') {
                            try {
                                err = JSON.parse(jqXHR.responseText);
                                if (err.error !== null && err.error !== undefined) {
                                    error = err.error;
                                    if (err.error.warning !== undefined && err.error.warning.featuresSkipped) {
                                        warning = locale.warning.features_skipped.replace(/<xx>/g, err.warning.featuresSkipped);
                                    }
                                }
                            } catch (e) {
                                Oskari.log(me.getName())
                                    .warn('Error whilst parsing json', e);
                            }
                        } else if (textStatus === 'timeout') {
                            error = textStatus;
                        } else if (textStatus === 'abort') {
                            error = textStatus;
                        } else if (textStatus === 'parsererror') {
                            error = textStatus;
                        }

                        // textual portion of the HTTP status
                        if (errorThrown) {
                            Oskari.log(me.getName()).warn('Error whilst importing userlayer: ' + errorThrown);
                        }

                        if (typeof error === 'string' && locale.error[error.toLowerCase()]) {
                            msg = locale.error[error.toLowerCase()];
                        } else {
                            msg = locale.error.generic;
                        }
                        if (warning) {
                            msg = msg + ' ' + warning;
                        }
                        me.__showMessage(title, msg, false);
                    }
                });
                // Prevent page from submitting
                return false;
            });
            return file;
        },

        /**
         * Returns the visualization form's values.
         *
         * @method __getStyleValues
         * @private
         * @param  {Oskari.userinterface.component.VisualizationForm} styleForm
         * @return {Object}
         */
        __getStyleValues: function (styleForm) {
            var formValues = styleForm.getValues(),
                values = {};

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
         * Returns true if there were any errors (missing values).
         *
         * @method __validateForm
         * @private
         * @param  {jQuery} form
         * @param  {Object} locale
         * @return {Boolean}
         */
        __validateForm: function (form, locale) {
            var fileInput = form.find('input[type=file]'),
                nameInput = form.find('input[name=layer-name]'),
                errors = false,
                errorTitle, errorMsg;

            if (!fileInput.val() || !nameInput.val()) {
                errors = true;
                errorTitle = locale.validations.error.title;
                errorMsg = locale.validations.error.message;
                this.__showMessage(errorTitle, errorMsg);
            }

            return errors;
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
        __finish: function (json, locale) {
            var title = locale.finish.success.title,
                msg = locale.finish.success.message,
                fadeout = true;

            if (json.warning !== undefined && json.warning.featuresSkipped) {
                msg = msg + ' ' + locale.warning.features_skipped.replace(/<xx>/g, json.warning.featuresSkipped);
                fadeout = false;
            }
            this.instance.addUserLayer(json);
            msg = msg.replace(/<xx>/g, json.featuresCount);
            this.__showMessage(title, msg, fadeout);
            this.refresh();
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
        __showMessage: function (title, message, fadeout) {
            fadeout = fadeout !== false;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                btn = dialog.createCloseButton(this.locale.actions.close);

            dialog.makeModal();
            dialog.show(title, message, [btn]);
            if (fadeout) {
                dialog.fadeout(5000);
            }
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });
