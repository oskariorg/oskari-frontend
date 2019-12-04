class LayerListToolingService {
    constructor () {
        this.tools = {};
        Oskari.makeObservable(this);
    }

    /**
     * @method getName
     * @return {String} service name
     */
    getName () {
        return 'LayerListToolingService';
    }

    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName () {
        return 'Oskari.mapframework.service.LayerListToolingService';
    }

    /**
     * @method addTool
     * To add a tool to the service.
     *
     * @param {Oskari.mapframework.domain.Tool} tool required
     */
    addTool (tool) {
        if (!tool || !tool.getName() || !tool.getCallback()) {
            return;
        }
        this.tools[tool.getName()] = tool;
        this.trigger('add', { tool });
    }

    getTools () {
        return this.tools;
    }
}

LayerListToolingService.TYPE_CREATE = 'create';

Oskari.clazz.defineES('Oskari.mapframework.service.LayerListToolingService',
    LayerListToolingService,
    { 'protocol': ['Oskari.mapframework.service.Service'] }
);
