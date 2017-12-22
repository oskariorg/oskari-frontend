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
            this.compileTemplates();
            this.ui = null;
            this.container = null;
            this.compileTemplates();
            this.badges = [];
        }, {
            templates: {
                "default": '<span class="oskari-badge"></span>',
                "success": '<span class="oskari-badge oskari-badge-success"></span>',
                "warning": '<span class="oskari-badge oskari-badge-warning"></span>',
                "important": '<span class="oskari-badge oskari-badge-important"></span>',
                "info": '<span class="oskari-badge oskari-badge-info"></span>',
                "inverse": '<span class="oskari-badge oskari-badge-inverse"></span>',
                "oskari":'<span class="oskari-badge oskari-badge-oskari"></span>',
                "wrapper": '<div class="badge-wrapper"></div>'
            },
            compileTemplates: function () {
                var p;
                for (p in this.templates) {
                    if (this.templates.hasOwnProperty(p)) {
                        this.compiledTemplates[p] = jQuery(this.templates[p]);
                    }
                }
            },
            insertTo: function (container) {
                this.container = container;
            },
            setContent: function (pContent, status) {
                if (this.ui) {
                    this.ui.remove();
                    this.ui = null;
                }

                var txtspan = this.compiledTemplates[status || 'default'].clone();
                var wrapper = this.compiledTemplates['wrapper'].clone();
                txtspan.append(pContent);
                wrapper.append(txtspan);
                this.container.append(wrapper);
                this.ui = txtspan;
                this.badges.push(txtspan);
                // this.calculateRightFloat();
            },
            getElement: function () {
                return this.ui;
            },
            calculateRightFloat: function () {
                var me = this;
                setTimeout(function() {
                    me.badges.forEach(function(badge) {
                        var parent = badge.parent();
                        var children = parent.children();
                        var childrenWidth = 0;
                        for ( var i = 0; i < children.length; i++ ) {
                            childrenWidth += jQuery(children[i]).width();
                        }
                        var margin = 560 - badge.offset().left;
                        console.log(margin);
                        badge.css("margin-left", margin);
                    });
                }, 2000);
            },
            hide: function () {
                if (this.ui) {
                    this.ui.remove();
                    this.ui = null;
                }
            }
        });
