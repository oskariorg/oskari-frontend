/**
 * @class Oskari.sample.info.SampleInfoBundleInstance
 */
Oskari.clazz.define('Oskari.sample.info.SampleInfoBundleInstance', function () {
    this.loc = Oskari.getMsg.bind(null, 'sample-info');
}, {
    __name: 'SampleInfoBundleInstance',
    _startImpl: function (sandbox) {
        this._registerForGuidedTour();
    },
    /**
     * @method _registerForGuidedTour
     * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
     */
    _registerForGuidedTour: function () {
        const sendRegister = () => {
            var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
            if (requestBuilder && this.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                var delegate = {
                    bundleName: this.getName(),
                    priority: 5,
                    getTitle: () => this.loc('guidedTour.title'),
                    getContent: () => this.loc('guidedTour.message'),
                    getPositionRef: () => jQuery('#login'),
                    positionAlign: 'right'
                };
                this.sandbox.request(this, requestBuilder(delegate));
            }
        };

        const tourInstance = this.sandbox.findRegisteredModuleInstance('GuidedTour');
        if (tourInstance) {
            sendRegister();
        } else {
            Oskari.on('bundle.start', (msg) => {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            });
        }
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
