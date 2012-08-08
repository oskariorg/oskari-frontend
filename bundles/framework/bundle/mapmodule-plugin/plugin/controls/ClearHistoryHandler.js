Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.controls.ClearHistoryHandler',
function(sandbox, mapModule) {
    this.mapModule = mapModule;
    this.sandbox = sandbox;
},
{
    __name: 'ClearHistoryHandler',
    getName: function() {
        return this.__name;
    },
    init: function(sandbox) {},
    handleRequest: function(core, request) {
        this.mapModule.clearNavigationHistory();
    }
},
{
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
