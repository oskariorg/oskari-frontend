Oskari.clazz.define('Oskari.mapframework.bundle.terrain-profile.TerrainPopup',
    function (cancelFunc, queryFunc) {
        var loc = Oskari.getMsg.bind(null, 'TerrainProfile');
        var title = loc('popupTitle');
        var buttons = [];
        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');

        cancelBtn.setHandler(cancelFunc);
        buttons.push(cancelBtn);

        var queryButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');

        queryButton.setTitle(loc('showProfile'));
        queryButton.setHandler(queryFunc);
        buttons.push(queryButton);

        var content = jQuery('<div>' + loc('popupText') + '</div>');

        this.show(title, content, buttons);
        this.moveTo('#toolbar div.tool[tool=TerrainProfile]', 'top');
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Popup']
    }
);
