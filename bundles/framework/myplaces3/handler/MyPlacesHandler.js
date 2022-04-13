import { StateHandler, controllerMixin } from 'oskari-ui/util';

class PlacesHandler extends StateHandler {
    constructor (consumer, instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            data: []
        });
        this.updater = null;
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.viewService = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.service.MypPlacesService', Oskari.urls.getRoute());
        this.addStateListener(consumer);
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'MyPlacesHandler';
    }

    setUpdateFunc (update) {
        this.updater = update;
    }

    showErrorMessage (title, message, buttonText) {
        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        const button = dialog.createCloseButton(buttonText);
        button.addClass('primary');
        dialog.show(title, message, [button]);
    }
}

const wrapped = controllerMixin(PlacesHandler, []);

export { wrapped as MyPlacesHandler };