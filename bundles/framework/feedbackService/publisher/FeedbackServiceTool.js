
Oskari.clazz.define('Oskari.mapframework.publisher.tool.FeedbackServiceTool',
    function() {
    }, {
        index : 9,
        apiUrl: null,
        apiKey: null,
        urlValue: null,
        keyValue: null,
        extensionsValue: null,
        templates: {
            'toolOptions': jQuery('<div class="tool-options"></div>'),
            'apiUrl': jQuery('<div id="publisher-feedback-apiurl" class="tool-options">' + '<label for="publisher-feedback-url"></label>' +  '<input type="text" name="publisher-feedback-url" />'  + '</div>'),
            'apiKey': jQuery('<div id="publisher-feedback-apikey" class="tool-options">' + '<label for="publisher-feedback-key"></label>' +  '<input type="text" name="publisher-feedback-key" />'  + '</div>'),
            'apiExtensions': jQuery('<div id="publisher-feedback-extensionskey" class="tool-options">' + '<label for="publisher-feedback-extensions"></label>' +  '<input type="text" name="publisher-feedback-extensions" />'  + '</div>')
        },
        getName: function() {
            return "Oskari.mapframework.publisher.tool.FeedbackServiceTool";
        },
        /**
         * Get tool object.
         * @method getTool
         *
         * @returns {Object} tool description
         */
        getTool: function(){
            return {
                //doesn't actually map to anything real, just need this in order to not break stuff in publisher
                id: 'Oskari.mapframework.publisher.tool.FeedbackServiceTool',
                title: 'FeedbackServiceTool',
                config: {}
            };
        },

    //Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
    bundleName: 'feedbackService',

    /**
     * Initialise tool
     * @method init
     */
    init: function(data) {
        var me = this;
        if (!data || !data.configuration[me.bundleName]) {
            return;
        }

        var conf = data.configuration[me.bundleName].conf || {};
        if(conf.publish){
            me.setEnabled(true);
        }
        var meta = data.metadata[me.bundleName] || {};
        me.urlValue = meta.url;
        me.keyValue = meta.key;
        me.extensionsValue = meta.extensions;

    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        var me = this;
        if(me.state.enabled) {
            return {
                configuration: {
                    feedbackService: {
                        conf: {
                            publish: true
                        },
                        state: {}
                    }
                },
                metadata: {
                    feedbackService: {
                        url: jQuery('input[name=publisher-feedback-url]').val() ? jQuery('input[name=publisher-feedback-url]').val() : null,
                        key: jQuery('input[name=publisher-feedback-key]').val() ? jQuery('input[name=publisher-feedback-key]').val() : null,
                        extensions: jQuery('input[name=publisher-feedback-extensions]').val() ? jQuery('input[name=publisher-feedback-extensions]').val() : null
                    }
                }
            };
        } else {
            return null;
        }
    },
     /**
     * Get extra options.
     * @method @public getExtraOptions
     * @param {Object} jQuery element toolContainer
     * @return {Object} jQuery element template
     */
     getExtraOptions: function (toolContainer) {
        var me = this,
            template = me.templates.toolOptions.clone(),
            apiUrl = me.templates.apiUrl.clone(),
            apiKey = me.templates.apiKey.clone(),
            apiExtensions = me.templates.apiExtensions.clone(),
            loc = Oskari.getLocalization('feedbackService', Oskari.getLang() || Oskari.getDefaultLanguage()),
            loc_pub = loc.display.publisher || {};

         // Set the localizations.
         apiUrl.find('label').html(loc_pub.apiUrl);
         apiKey.find('label').html(loc_pub.apiKey);
         apiExtensions.find('label').html(loc_pub.apiExtensions);
         template.append(apiUrl);
         template.append(apiKey);
         template.append(apiExtensions);

         // Prepopulate data
         template.find('input[name=publisher-feedback-url]').attr('placeholder', loc_pub.urlPlaceholder).val(me.urlValue);
         template.find('input[name=publisher-feedback-key]').attr('placeholder', loc_pub.keyPlaceholder).val(me.keyValue);
         template.find('input[name=publisher-feedback-extensions]').attr('placeholder', loc_pub.extensionsPlaceholder).val(me.extensionsValue);

         return template;
     },
        setEnabled: function(enabled) {
            var me = this;
            me.state.enabled = (enabled === true) ? true : false;
        }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});