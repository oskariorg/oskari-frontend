/**
 * @class Oskari.userinterface.component.FileInput
 * Simple file uploading component
 * Call create to create element and with getElement reference the element.
 */
Oskari.clazz.define('Oskari.userinterface.component.FileInput', function () {
    this.loc = Oskari.getMsg.bind(null, 'DivManazer');
    this.el = null;
    this._template = {
        fileBox: _.template('<div class="oskari-fileinput" style="display:none"> '+
                    '<form method="post" action="" enctype="multipart/form-data" class="box">'+
                        '<div class="box__input">'+
                            '<input type="file" class="box__file" />'+
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
            return ( ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div) )
                        && 'FormData' in window && 'FileReader' in window;
         },
        /**
         * @method handleDragAndDrop
         * Checks for drag and drop events, on submit makes ajax request
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
            });
            this.setElement( form.parent() );
            return this.getElement();
        },
        /**
         * @method readFilesInBrowser
         * Checks for drag and drop events, on submit makes ajax request
         */
        readFilesInBrowser: function ( files, cb ) {
            var files = files; // FileList object

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
        /**
         * @method create
         * Creates the element for handlign drag and drop
         */
        create: function() {
            var fileinput = this._template.fileBox({ link: this.loc('fileInput').link,
                                                    fileupload: this.loc('fileInput').fileupload,
                                                    uploading: this.loc('fileInput').uploading,
                                                    success: this.loc('fileInput').success,
                                                    error: this.loc('fileInput').error });
            this.setElement(fileinput);

            // if( this.canUseAdvancedUpload ) {
            //     this.handleDragAndDrop( fileinput );
            // }
            // return this.getElement();
        },
        exportToFile: function ( data, filename ) {
            var me = this;
            var blob = new Blob([data], {type: 'text'});
            if( window.navigator.msSaveOrOpenBlob ) {
                window.navigator.msSaveBlob(blob, filename);
            }
            else {
                var elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(blob);
                elem.download = filename;        
                document.body.appendChild(elem);
                elem.click();        
                document.body.removeChild(elem);
            }
        }
}, {

});