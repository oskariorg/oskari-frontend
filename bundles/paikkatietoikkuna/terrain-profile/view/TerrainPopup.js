Oskari.clazz.define('Oskari.mapframework.bundle.terrain-profile.TerrainPopup',
    function (cancelFunc, queryFunc) {
        var title = 'Terrain Profile';
        var buttons = [];
        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');

        cancelBtn.setHandler(cancelFunc);
        buttons.push(cancelBtn);

        var queryButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');

        queryButton.setTitle('Show profile');
        queryButton.setHandler(queryFunc);
        buttons.push(queryButton);

        var content = jQuery('<div></div>');

        this.show(title, content, buttons);
        this.moveTo('#toolbar div.tool[tool=TerrainProfile]', 'top');
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Popup']
    }
);
