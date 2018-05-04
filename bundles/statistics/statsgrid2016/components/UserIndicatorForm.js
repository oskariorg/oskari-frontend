Oskari.clazz.define('Oskari.statistics.statsgrid.UserIndicatorForm', function ( service, locale, datasource ) {
    this.locale = locale;
    this.service = service;
    this.addIndicatorDataForm = Oskari.clazz.create('Oskari.statistics.statsgrid.UserIndicatorDataForm', service, locale, datasource);
    this.element = null;
    if ( !this.getElement() ) {
        this.createUi();
    }
}, {
    __templates: {
        main: _.template('<div class="stats-indicator-form"> '+
                            '<div class="stats-not-logged-in oskari-hidden">${warning}</div>'+
                            '<form id="stats-user-indicator">'+
                            '   <input class="stats-indicator-form-item" type="text" name="name" placeholder="${name}"><br>'+
                            '   <textarea class="stats-indicator-form-item" name="description" form="stats-user-indicator" placeholder="${description}"></textarea> '+ 
                            '   <input class="stats-indicator-form-item" type="text" name="datasource" placeholder="${source}"><br>'+
                            '</form>'+
                        '</div>')
    },
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },
    isLoggedIn: function () {
        return Oskari.user().isLoggedIn();
    },
    getFormData: function () {
        var elements = this.getElement().find('.stats-indicator-form-item');
        var data = {};
        elements.filter( function (index, element) {
            element = jQuery(element);
            var key = element.attr("name");
            data[key] = element.val();
        });
    },
    clearUi: function () {
        if (this.element === null) {
            return;
        }
        this.element.empty();
    },
    createUi: function () {
        var me = this;
        this.clearUi();

        var main = this.__templates.main({
            warning: this.locale.userIndicators.notLoggedInWarning,
            name: this.locale.userIndicators.formName,
            description: this.locale.userIndicators.formDescription,
            source: this.locale.userIndicators.formDatasource
        });
        var jMain = jQuery(main);
        if ( !this.isLoggedIn() ) {
            jMain.find('.stats-not-logged-in').removeClass('oskari-hidden');
        }
        me.addIndicatorDataForm.render(jMain);
        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btn.setTitle(this.locale.userIndicators.buttonSave);
        btn.insertTo( jMain );

        btn.setHandler(function (event) {
            event.stopPropagation();
            me.getFormData();
        });
        var indBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        indBtn.setTitle(this.locale.userIndicators.buttonAddIndicator);
        indBtn.insertTo( jMain );

        indBtn.setHandler(function (event) {
            event.stopPropagation();
            me.addIndicatorDataForm.toggle();
        });

        this.setElement(jMain);
    },
    render: function (el) {
        el.append( this.getElement() );
    }

});