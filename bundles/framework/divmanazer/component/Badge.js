/**
 * @class Oskari.userinterface.component.Badge
 */
Oskari.clazz
    .define('Oskari.userinterface.component.Badge',

        /**
         * @method create called automatically on construction
         * @static
         *
         */

        function () {
            this.compiledTemplates = {};
            this.ui = null;
            this.container = null;
            this.supportedTypes = [
                "default",
                "success",
                "warning",
                "important",
                "info",
                "inverse",
                "oskari",
                "oskari-inverse"
            ];
        }, {
            templates: {
                "wrapper": jQuery('<div class="badge-wrapper"></div>')
            },
            getTemplate: function(type) {
                if(this.supportedTypes.indexOf(type) === -1) {
                    type = this.supportedTypes[0];
                }
                return jQuery('<span class="oskari-badge oskari-badge-' + type + '"></span>');
            },
            insertTo: function (container) {
                this.container = container;
            },
            setContent: function (pContent, status) {
                if (this.ui) {
                    this.ui.remove();
                    this.ui = null;
                }

                var txtspan = this.getTemplate(status);
                var wrapper = this.templates.wrapper.clone();
                txtspan.html(pContent);
                wrapper.append(txtspan);
                this.container.append(wrapper);
                this.ui = txtspan;
            },
            updateContent: function (content) {
                if( !this.ui ) {
                    return;
                }
                this.ui.html(content);
            },
            getElement: function () {
                return this.ui;
            },
            hide: function () {
                if (this.ui) {
                    this.ui.remove();
                    this.ui = null;
                }
            }
        });
