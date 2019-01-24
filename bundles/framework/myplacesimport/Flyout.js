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
                        '<div class="name"><label>Name</label><input type="text" /></div>' +
                        '<div class="desc"><label>Description</label><input type="text"/></div>' +
                        '<div class="source"><label>Data source</label><input type="text"/></div>' +
                        '<div class="source-srs oskari-hidden"><label>Source EPSG</label><input type="text" placeholder="4326"/></div>' +
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
            this.fileInput.removeFiles();
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
            file.find('div.source-srs label').html(this.loc('flyout.layer.srs'));
            file.find('div.style-form').html(this.styleForm.getForm());
            file.find('input[type=button]').val(this.loc('flyout.actions.submit'));

            file.find('input[type=button]').on('click', function (e) {
                // Prevent from sending if there were missing fields
                if (!me.__validateForm()) {
                    return;
                }
                me.submitUserLayer();
            });
            return file;
        },
        submitUserLayer: function () {
            var me = this;
            var formValues = this.getFormValues();
            var formData = new FormData();
            var url = this._getImportUrl(formValues.epsg);
            formData.append('layer-name', formValues.name);
            formData.append('layer-desc', formValues.desc);
            formData.append('layer-source', formValues.source);
            formData.append('file-import', this.fileInput.getFiles());
            formData.append('layer-style', JSON.stringify(me.__getStyleValues()));
            jQuery.ajax({
                url: url,
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
        getFormValues: function () {
            var form = this.getTemplate().find('form');
            return {
                name: form.find('.name input').val().trim(),
                desc: form.find('.desc input').val(),
                source: form.find('.source input').val(),
                epsg: form.find('.source-srs input').val().trim()
            };
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
         * @return {Boolean}
         */
        __validateForm: function () {
            var values = this.getFormValues();
            var errors = [];
            if (!values.name) {
                errors.push(this.loc('flyout.validations.error.name'));
            }
            if (!this.fileInput.hasFiles()) {
                errors.push(this.loc('flyout.validations.error.file'));
            }
            // if value (string) exists, has to be not NaN and length 4-5
            if (values.epsg && (isNaN(values.epsg) || values.epsg.length < 4 || values.epsg.length > 5)) {
                errors.push(this.loc('flyout.validations.error.epsg'));
            }
            if (errors.length === 0) {
                return true;
            }
            this.__showMessage(this.loc('flyout.validations.error.title'), this.loc('flyout.validations.error.message'), false, errors, 'li');
            return false;
        },
        _showEpsgInput: function (bln) {
            this.getTemplate().find('.source-srs').removeClass('oskari-hidden');
        },
        _getImportUrl: function (epsgValue) {
            var url = this.instance.getService().getFileImportUrl();
            if (epsgValue) {
                return url + '&sourceEpsg=EPSG:' + epsgValue;
            }
            return url;
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
            var errors = this.loc('flyout.error');
            if (response.status === 404 || !response.responseJSON || !response.responseJSON.info) {
                this.__showMessage(errors.title, errors.generic, false);
                return;
            }
            var list = [];
            var msg;
            const errorInfo = response.responseJSON.info;
            const key = errorInfo.error;
            switch (key) {
            case 'multiple_extensions':
                msg = this.loc('flyout.error.multiple_extensions', {extension: errorInfo.extensions});
                break;
            case 'multiple_main_file':
                msg = this.loc('flyout.error.multiple_main_file', {extensions: errorInfo.extensions});
                break;
            case 'file_over_size':
                msg = this.loc('flyout.error.file_over_size', {maxSize: this.maxFileSize});
                break;
            case 'no_main_file':
                list.push(errors.no_main_file);
                if (errorInfo.ignored) {
                    if (Object.keys(errorInfo.ignored).some(key => errorInfo.ignored[key] === 'folder')) {
                        list.push(errors.has_folders);
                    }
                }
                break;
            case 'parser_error':
                if (errorInfo.cause === 'unknown_projection') {
                    this._showEpsgInput();
                    msg = errors.noSrs;
                    if (errorInfo.parser === 'shp') {
                        msg = errors.shpNoSrs;
                    }
                    break;
                }
                // common parser error
                list.push(errors[errorInfo.parser]);
                if (errorInfo.cause === 'format_failure') {
                    list.push(errors.format_failure);
                } else {
                    list.push(errors.parser_generic);
                }
                break;
            default:
                if (errors[key]) {
                    msg = errors[key];
                } else {
                    msg = errors.generic;
                }
            }
            this.__showMessage(errors.title, msg, false, list);
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
        __showMessage: function (title, message, fadeout, msgList, listType) {
            fadeout = fadeout !== false;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var btn = dialog.createCloseButton(this.loc('flyout.actions.close'));
            dialog.addClass('myplacesimport');
            var content = message === undefined ? '' : message + ' ';
            if (Array.isArray(msgList)) {
                if (listType === 'li') {
                    content += '<ul><li>' + msgList.join('</li><li>') + '</li></ul>';
                } else if (listType === 'p') {
                    content += '<p>' + msgList.join('</p><p>') + '</p>';
                } else {
                    content += msgList.join(' ');
                }
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
