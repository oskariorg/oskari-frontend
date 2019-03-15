
export class LayerWizardService {
    constructor (consumer) {
        this.layer = {};
        this.capabilities = [];
        this.listeners = [consumer];
        this.loading = false;
    }
    getLayerTypes () {
        return ['WFS'];
    }
    hasType () {
        return typeof this.layer.type !== 'undefined';
    }
    hasVersion () {
        return typeof this.layer.version !== 'undefined';
    }
    isLoading () {
        return this.loading;
    }
    getLayer () {
        return {...this.layer};
    }
    getCapabilities () {
        return this.capabilities;
    }
    getMutator () {
        const me = this;
        return {
            setType (type) {
                me.layer.type = type;
                me.notify();
            },
            setVersion (url, version) {
                if (!url || !version) {
                    me.capabilities = [];
                    me.loading = false;
                    // for moving back to previous step
                    me.layer.version = undefined;
                    me.layer.url = undefined;
                    me.notify();
                    return;
                }
                me.loading = true;
                me.layer.url = url;
                me.notify();
                alert(`TODO: fetch capabilities for: ${me.getLayer().type} ${version} on ${url}`);
                setTimeout(() => {
                    me.layer.version = version;
                    me.capabilities = [{
                        name: 'fake'
                    }, {
                        name: 'it'
                    }, {
                        name: 'till'
                    }, {
                        name: 'you'
                    }, {
                        name: 'make it'
                    }];
                    me.loading = false;
                    me.notify();
                }, 2000);
            }
        };
    }
    addListener (consumer) {
        this.listeners.push(consumer);
    }
    notify () {
        this.listeners.forEach(consumer => consumer());
    }
}
