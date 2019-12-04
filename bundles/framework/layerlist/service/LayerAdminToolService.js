class LayerAdminToolService {
    constructor () {
        this.tools = {};
        Oskari.makeObservable(this);
    }

    /**
     * @method getName
     * @return {String} service name
     */
    getName () {
        return 'LayerAdminToolService';
    }

    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName () {
        return 'Oskari.mapframework.service.LayerAdminToolService';
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

LayerAdminToolService.TYPE_CREATE = 'create';

Oskari.clazz.defineES('Oskari.mapframework.service.LayerAdminToolService',
    LayerAdminToolService,
    { 'protocol': ['Oskari.mapframework.service.Service'] }
);
