/**
 * @class Oskari.elf.geolocator.BundleInstance
 */
Oskari.clazz.define("Oskari.elf.geolocator.BundleInstance",
    function() {
        this.buttonGroup = 'basictools';
        this.toolName = 'geolocator';
        this.tool = {
            iconCls: 'icon-geolocator',
            sticky: true
        };
    }, {
        __name : 'elf-geolocator',
        getName : function () {
            return this.__name;
        },
        /**
         * BundleInstance protocol method
         * 
         * @method start
         */
        start: function () {
            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request;

            this.sandbox = sandbox;
            sandbox.register(this);

            // stateful
            if (conf && conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }

            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');
            sandbox.request(this, request(this));

            this.registerTool();
        },
        /**
         * Requests the tool to be added to the toolbar.
         * 
         * @method registerTool
         */
        registerTool: function() {
            var me = this,
                loc = this.getLocalization(),
                sandbox = this.getSandbox(),
                reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
                request;

            this.tool.callback = function() {
                //me.startTool();
            };
            this.tool.tooltip = 'loc.tool.tooltip';

            if (reqBuilder) {
                request = reqBuilder(this.toolName, this.buttonGroup, this.tool);
                sandbox.request(this, request);
            }
        },
    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});
