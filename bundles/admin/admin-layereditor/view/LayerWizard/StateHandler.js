
export class StateHandler {
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
            setName (name) {
                if (!name) {
                    me.layer.name = undefined;
                    me.notify();
                    return;
                }
                const found = me.capabilities.find((item) => item.name === name);
                if (found) {
                    me.layer = {
                        ...me.layer,
                        ...found
                    };
                } else {
                    // TODO: not found -> error that should not happen
                    this.setName();
                }
                me.notify();
            },
            setUrl (url) {
                me.layer.url = url;
                me.notify();
            },
            setVersion (version) {
                if (!version) {
                    me.capabilities = [];
                    me.loading = false;
                    // for moving back to previous step
                    me.layer.version = undefined;
                    me.notify();
                    return;
                }
                me.loading = true;
                me.notify();
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
                }, 1000);
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
