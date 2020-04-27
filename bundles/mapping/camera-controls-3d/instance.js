const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');

const GUIDED_TOUR_TEMPLATE = {
    priority: 100,
    positionAlign: 'left',
    getTitle: () => Oskari.getMsg('CameraControls3d', 'guidedTour.title'),
    getContent: () => {
        const content = jQuery('<div></div>');
        content.append(Oskari.getMsg('CameraControls3d', 'guidedTour.message'));
        return content;
    },
    getPositionRef: () => jQuery('.camera-controls-3d')
};

Oskari.clazz.defineES('Oskari.mapping.cameracontrols3d.instance',
    class CameraControls3dBundleInstance extends BasicBundle {
        constructor () {
            super();
            this._started = false;
            this.plugin = null;
            this._mapmodule = null;
            this._sandbox = null;
            this.state = undefined;
            this.name = 'camera-controls-3d';
        }
        getName () {
            return this.name;
        }
        start (sandbox) {
            if (this._started) {
                return;
            }
            this.sandbox = sandbox || Oskari.getSandbox();
            this._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            this.createPlugin();
            this.sandbox.register(this);
            this._registerForGuidedTour();
            this._started = true;
        }
        createPlugin () {
            if (this.plugin) {
                return;
            }
            const conf = this.conf || {};
            this.plugin = Oskari.clazz.create('Oskari.mapping.cameracontrols3d.CameraControls3dPlugin', conf);
            this._mapmodule.registerPlugin(this.plugin);
            this._mapmodule.startPlugin(this.plugin);
        }
        stopPlugin () {
            this._mapmodule.unregisterPlugin(this.plugin);
            this._mapmodule.stopPlugin(this.plugin);
            this.plugin = null;
        }
        stop () {
            this.stopPlugin();
            this.sandbox = null;
            this.started = false;
        }
        _registerForGuidedTour () {
            const me = this;
            function sendRegister () {
                const requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if (requestBuilder) {
                    const delegate = {
                        bundleName: me.getName()
                    };
                    for (let prop in GUIDED_TOUR_TEMPLATE) {
                        if (typeof GUIDED_TOUR_TEMPLATE[prop] === 'function') {
                            delegate[prop] = GUIDED_TOUR_TEMPLATE[prop].bind(me); // bind methods to bundle instance
                        } else {
                            delegate[prop] = GUIDED_TOUR_TEMPLATE[prop]; // assign values
                        }
                    }
                    me.sandbox.request(me, requestBuilder(delegate));
                }
            }

            function handler (msg) {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            if (this.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
    }
);
