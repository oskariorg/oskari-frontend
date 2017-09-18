/**
 * @class Oskari.userinterface.component.FileInput
 *
 */
Oskari.clazz.define('Oskari.userinterface.component.FileInput', function (localization) {
    this.loc = localization;
    this.el = null;
    this._template = {
        fileBox: _.template('<div class="oskari-fileinput" style="display:none"> '+
                    '<form method="post" action="", enctype="multipart/form-data" class="box" id="fileinput">'+
                        '<div class="box__input">'+
                            '<input type="file" name="file" id="file" class="box__file" />'+
                            '<label>  <%= fileupload %> <label for="file" style="cursor: pointer;"> <a> <%= link %> </a> </label> </label> '+
                        '</div>'+
                        '<div class="box__uploading"> <%= uploading %>&hellip;</div>'+
                        '<div class="box__success"><%= success %></div>'+
                        '<div class="box__error"><%= error %></div>'+
                    '</form>' +
                '</div>')
    }
}, {
        getElement: function () {
            return this.el;
        },
        setElement: function ( el ) {
            this.el = jQuery(el);
        },
        /**
         * @method canUseAdvancedUpload
         *
         * Checks if the browser supports drag and drop events aswell as formdata & filereader
         * @return {boolean} true if supported 
         */
        canUseAdvancedUpload: function() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
         },
                /**
         * @method handleDragAndDrop
         * Checks for drag and drop events, on submit makes ajax request
         * 
         *
         */
        handleDragAndDrop: function( cb ) {
            var me = this;
            var form = this.getElement().find('.box');
            var input = form.find('input[type="file"]');
            form.addClass('has-advanced-upload');
            var droppedFiles = false;

            form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
            })
            .on('dragover dragenter', function() {
                form.addClass('is-dragover');
            })
            .on('dragleave dragend drop', function() {
                form.removeClass('is-dragover');
            })
            .on('drop', function(e) {
                droppedFiles = e.originalEvent.dataTransfer.files;
                // form.trigger('submit');
                me.readFilesInBrowser( droppedFiles, cb );
            });
            

            form.on('submit', function(e) {
                if (form.hasClass('is-uploading')) return false;

                form.addClass('is-uploading').removeClass('is-error');

                e.preventDefault();

                var ajaxData = new FormData(form.get(0));

                if ( droppedFiles ) {
                    jQuery.each( droppedFiles, function(i, file) {
                        ajaxData.append( input.attr('name'), file );
                    });
                }

                // jQuery.ajax({
                //     url: form.attr('action'),
                //     type: form.attr('method'),
                //     data: ajaxData,
                //     dataType: 'json',
                //     cache: false,
                //     contentType: false,
                //     processData: false,
                //     complete: function() {
                //         form.removeClass('is-uploading');
                //     },
                //     success: function(data) {
                //         form.addClass( data.success == true ? 'is-success' : 'is-error' );
                //         if (!data.success) $errorMsg.text(data.error);
                //     },
                //     error: function() {
                //         form.addClass('is-error').removeClass('is-uploading');
                //     // Log the error, show an alert, whatever works for you
                //     }
                // });
            
            });
            this.setElement( form.parent() );
            return this.getElement();
        },
        readFilesInBrowser: function ( files, cb ) {
            var files = files; // FileList object

            // Loop through the FileList and render image files as thumbnails.
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = ( function( file ) {
                    return function(e) {
                        var fileContent = e.target.result;
                        cb( fileContent );
                    };
                })(f);

                reader.readAsText(f);
            
            }
        },
        create: function() {
            var fileinput = this._template.fileBox({ link: this.loc.datasourceinfo.link,
                                                    fileupload: this.loc.datasourceinfo.fileupload,
                                                    uploading: this.loc.datasourceinfo.uploading,
                                                    success: this.loc.datasourceinfo.success,
                                                    error: this.loc.datasourceinfo.error });
            this.setElement(fileinput);

            // if( this.canUseAdvancedUpload ) {
            //     this.handleDragAndDrop( fileinput );
            // }
            // return this.getElement();
        },
        exportToFile: function ( data, filename ) {
            var me = this;
            function onInitFs(fs) {

            fs.root.getFile( filename, {create: true}, function(fileEntry) {
                console.log(fs.root);

                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter( function( fileWriter ) {

                fileWriter.onwriteend = function(e) {
                    console.log('Write completed.');
                };

                fileWriter.onerror = function(e) {
                    console.log('Write failed: ' + e.toString());
                };

                // Create a new Blob and write it to log.txt.
                var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

                fileWriter.write(blob);

                }, me.errorHandler);

            }, me.errorHandler);

            }

            window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, me.errorHandler);
        },
         errorHandler: function( e ) {
            var msg = '';

            switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
                case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
                case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
                case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
                case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
                default:
                msg = 'Unknown Error';
                break;
            };

            console.log('Error: ' + msg);
        }
}, {

});