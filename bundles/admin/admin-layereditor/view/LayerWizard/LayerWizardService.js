
export class LayerWizardService {
    constructor (consumer) {
        this.layer = {};
        this.capabilities = [];
        this.listeners = [consumer];
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
    getLayer () {
        return {...this.layer};
    }
    getMutator () {
        const me = this;
        return {
            setType (type) {
                me.layer.type = type;
                me.notify();
            },
            setVersion (version) {
                me.layer.version = version;
                me.notify();
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
