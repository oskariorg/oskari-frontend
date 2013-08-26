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
            "use strict";
            this.compiledTemplates = {};
            this.compileTemplates();
            this.ui = null;
            this.container = null;
        }, {
            templates: {
                "default": '<span class="oskari-badge"></span>',
                "success": '<span class="oskari-badge oskari-badge-success"></span>',
                "warning": '<span class="oskari-badge oskari-badge-warning"></span>',
                "important": '<span class="oskari-badge oskari-badge-important"></span>',
                "info": '<span class="oskari-badge oskari-badge-info"></span>',
                "inverse": '<span class="oskari-badge oskari-badge-inverse"></span>'
            },
            compileTemplates: function () {
                "use strict";
                var p;
                for (p in this.templates) {
                    if (this.templates.hasOwnProperty(p)) {
                        this.compiledTemplates[p] = jQuery(this.templates[p]);
                    }
                }
            },
            insertTo: function (container) {
                "use strict";
                this.container = container;
            },
            setContent: function (pContent, status) {
                "use strict";
                if (this.ui) {
                    this.ui.remove();
                    this.ui = null;
                }

                var txtspan = this.compiledTemplates[status || 'default'].clone();
                txtspan.append(pContent);
                this.container.append(txtspan);
                this.ui = txtspan;
            },
            hide: function () {
                "use strict";
                if (this.ui) {
                    this.ui.remove();
                    this.ui = null;
                }
            }
        });
