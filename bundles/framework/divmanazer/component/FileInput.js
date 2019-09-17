/**
 * @class Oskari.userinterface.component.FileInput
 * Simple file uploading component
 * Call create to create element and with getElement reference the element.
 */
Oskari.clazz.define('Oskari.userinterface.component.FileInput', function (options) {
    this.loc = Oskari.getMsg.bind(null, 'DivManazer');
    this.element = null;
    this.files = [];
    this.options = options || {
        'allowMultipleFiles': false,
        'maxFileSize': 10, // MB
        // if both types and extensions are empty -> allow all
        'allowedFileTypes': [], // MIME types e.g. "text/plain"
        'allowedFileExtensions': [], // File extensions without dot e.g. "txt"
        'showNoFile': true // shows error popup when getFiles() is called and file isn't given
    };
    this.visible = true;

    this._template = {
        fileBox: _.template('<div class="<%= classes %>"> ' +
            '<div class="box__input">' +
                '<input type="file" class="box__file" accept="<%= allowedFiles %>" />' +
                    '<label><%= fileupload %>' +
                        '&nbsp;<a href="javascript:void(0);"><%= link %></a>' +
                    '</label> ' +
            '</div>' +
            '<div class="box__uploaded"></div>' +
        '</div>'),
        basicInput: _.template(
            '<div class="<%= classes %>">' +
                '<input type="file" class="basic__file" accept="<%= allowedFiles %>" <%= allowMultiple %> />' +
            '</div>')
    };
    this.isAdvancedUpload = this._canUseAdvancedUpload();
    this._createUi();
}, {
    getElement: function () {
        return this.element;
    },
    setElement: function (el) {
        this.element = el;
    },
    getOptions: function () {
        return this.options;
    },
    setOptions: function (options) {
        this.options = options;
    },
    /**
         * @method _canUseAdvancedUpload
         *
         * Checks if the browser supports drag and drop events aswell as formdata & filereader
         * @return {boolean} true if supported
         */
    _canUseAdvancedUpload: function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) &&
                        'FormData' in window && 'FileReader' in window;
    },
    /**
         * @method _bindAdvancedUpload
         * Checks for drag and drop events and select
         */
    _bindAdvancedUpload: function () {
        var me = this;
        var elem = this.getElement();
        var link = elem.find('a');
        var input = elem.find('input[type="file"]');

        elem.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
            .on('dragover dragenter', function () {
                elem.addClass('is-dragover');
            })
            .on('dragleave dragend drop', function () {
                elem.removeClass('is-dragover');
            })
            .on('drop', function (e) {
                me._handleFileList(e.originalEvent.dataTransfer.files);
            });

        link.on('click', function () {
            input.trigger('click');
        });

        input.on('change', function (e) {
            me._handleFileList(e.target.files);
        });

        /*
            elem.on('submit', function(e) {
                if (form.hasClass('is-uploading')) return false;

                form.addClass('is-uploading').removeClass('is-error');

                e.preventDefault();

                //var ajaxData = new FormData(form.get(0));

                if ( droppedFiles ) {
                    jQuery.each( droppedFiles, function(i, file) {
                        ajaxData.append( input.attr('name'), file );
                    });
                }
            });
            this.setElement( form.parent() );
            */
    },
    _bindBasicUpload: function () {
        var me = this;
        var elem = this.getElement();
        var input = elem.find('input[type="file"]');
        input.on('change', function (e) {
            me._handleFileList(e.target.files);
        });
    },
    _handleFileList: function (fileList) {
        var me = this;
        var opts = this.options;
        var files = fileList;
        var file;

        if (opts.allowMultipleFiles === true) {
            Object.keys(files).forEach(function (key) {
                file = files[key];
                if (me._validateFile(file) === true) {
                    me.files.push(file);
                } else {
                    // TODO or keep valid files
                    me.files = [];
                }
            });
        } else {
            if (files.length > 1) {
                this._showPopup(this.loc('fileInput.error'), this.loc('fileInput.multipleNotAllowed'));
            } else {
                file = files[0];
                if (file && this._validateFile(file) === true) {
                    this.files = [file];
                } else {
                    this.files = [];
                }
            }
        }
        if (this.isAdvancedUpload) {
            this._updateFileList();
        }
    },
    _updateFileList: function () {
        var fileNameElem = this.getElement().find('.box__uploaded');
        var files = this.files;

        var fileNames = files.map(function (file) {
            return file.name;
        }).join(', ');

        fileNameElem.text(fileNames);
    },
    _validateFile: function (file) {
        var valid = true;
        var opts = this.options;
        var allowedExtensions = opts.allowedFileExtensions;
        var message;

        if (this._checkFileType(file) === false) {
            valid = false;
            message = this.loc('fileInput.invalidType');
            if (Array.isArray(allowedExtensions) && allowedExtensions.length > 0) {
                allowedExtensions = '.' + allowedExtensions.join(', .');
                message += '<br>' + this.loc('fileInput.allowedExtensions', {allowedExtensions: allowedExtensions});
            }
            this._showPopup(this.loc('fileInput.error'), message);
        }
        // if max file size is defined check that file isn't too large
        if (opts.maxFileSize && file.size > opts.maxFileSize * 1048576) {
            valid = false;
            this._showPopup(this.loc('fileInput.error'), this.loc('fileInput.fileSize', {size: opts.maxFileSize}));
        }
        return valid;
    },
    getFiles: function () {
        var files = this.files;
        var opts = this.options;
        if (files.length === 0) {
            if (opts.showNoFile !== false) {
                this._showPopup(this.loc('fileInput.error'), this.loc('fileInput.noFiles'));
            }
            return null;
        } else if (opts.allowMultipleFiles !== true) {
            return files[0]; // or should we use getFile() for single file (allowMultiple false)
        } else {
            return files;
        }
    },
    /**
         * @method readFilesInBrowser
         * Checks for drag and drop events, on submit makes ajax request
         */
    // TODO do we need this?? If we want to check that unknown file type is text file, then this should help
    _readFilesInBrowser: function (files, cb) {
        for (var i = 0, f; files[i]; i++) {
            f = files[i];
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (file) {
                return function (e) {
                    var fileContent = e.target.result;
                    cb(fileContent);
                };
            })(f);
            reader.readAsText(f);
        }
    },
    /**
         * @method create
         * Creates the element for handlign drag and drop
         */
    _createUi: function () {
        var allowedFiles = this._getAcceptedTypesString();
        var fileInput;
        var fileUpload;
        var opts = this.options;
        var allowMultiple;

        if (opts.allowMultipleFiles === true) {
            allowMultiple = 'multiple';
            fileUpload = this.loc('fileInput.fileUpload', {files: 2});
        } else {
            allowMultiple = '';
            fileUpload = this.loc('fileInput.fileUpload', {files: 1});
        }

        if (this.isAdvancedUpload) {
            fileInput = jQuery(this._template.fileBox({
                link: this.loc('fileInput.link'),
                allowedFiles: allowedFiles,
                classes: 'oskari-fileinput advanced-upload',
                fileupload: fileUpload,
                allowMultiple: allowMultiple,
                uploading: this.loc('fileInput.uploading'),
                success: this.loc('fileInput.success'),
                error: this.loc('fileInput.error')
            }));
            this.setElement(fileInput);
            this._bindAdvancedUpload();
            this._addTooltip();
        } else {
            fileInput = jQuery(this._template.basicInput({
                classes: 'oskari-fileinput basic-upload',
                allowMultiple: allowMultiple,
                allowedFiles: allowedFiles
            }));
            this.setElement(fileInput);
            this._bindBasicUpload(fileInput);
        }
    },
    _getAcceptedTypesString: function () {
        var allowedTypes = Array.isArray(this.options.allowedFileTypes) ? this.options.allowedFileTypes : [];
        var allowedExtensions = Array.isArray(this.options.allowedFileExtensions) ? this.options.allowedFileExtensions : [];
        var acceptedFiles = [];
        if (allowedTypes.length === 0 && allowedExtensions.length === 0) {
            // if not defined in option, accept all
            return '';
        } else {
            allowedTypes.forEach(function (type) {
                acceptedFiles.push(type);
            });
            allowedExtensions.forEach(function (extension) {
                acceptedFiles.push('.' + extension);
            });
            return acceptedFiles.map(function (file) {
                return file;
            }).join(',');
        }
    },
    /**
         * @method _checkFileType
         * if options allowedFileTypes is defined and not empty list then check that file type is allowed
         */
    _checkFileType: function (file) {
        var types = Array.isArray(this.options.allowedFileTypes) ? this.options.allowedFileTypes : [];
        var extensions = Array.isArray(this.options.allowedFileExtensions) ? this.options.allowedFileExtensions : [];
        var fileType = file.type;
        var extension = file.name.split('.').pop();
        var validType;
        var validExtension;
        // if both types and extensions are empty -> allow all
        if (types.length === 0 && extensions.length === 0) {
            return true;
        }
        validType = types.some(function (type) {
            return type === fileType;
        });
        validExtension = extensions.some(function (type) {
            return type === extension.toLowerCase();
        });
        return (validType || validExtension);
    },
    _addTooltip: function () {
        var elem = this.getElement();
        var allowedExtensions = this.options.allowedFileExtensions;
        var tooltip;
        if (Array.isArray(allowedExtensions) && allowedExtensions.length !== 0) {
            allowedExtensions = '.' + allowedExtensions.join(', .');
            tooltip = this.loc('fileInput.allowedExtensions', {allowedExtensions: allowedExtensions});
            elem.prop('title', tooltip);
        }
    },
    setVisible: function (visible) {
        var elem = this.getElement();
        if (visible === false) {
            elem.css('display', 'none');
        } else {
            elem.css('display', '');
        }
    },
    // TODO should these be in different place
    exportToFile: function (data, filename, type) {
        var blob = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.trigger('click');
            document.body.removeChild(elem);
        }
    },
    _showPopup: function (title, msg) {
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = dialog.createCloseButton(this.loc('buttons.close'));
        dialog.show(title, msg, [btn]);
    }
}, {
});
