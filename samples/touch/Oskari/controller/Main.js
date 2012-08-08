Ext.define('Oskari.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        profile: Ext.os.deviceType.toLowerCase()
    },

    views : [
        'Main'//,
        /*'NestedList',
        'List',
        'SourceOverlay',
        'Buttons',
        'Forms',
        'Icons',
        'BottomTabs',
        'Map',
        'Overlays',
        'Tabs',
        'Toolbars',
        'Slide',
        'Pop',
        'Fade',
        'Flip',
        'JSONP',
        'YQL',
        'Ajax',
        'Video',
        'Audio',
        'NestedLoading',
        'Carousel',
        'TouchEvents'*/
    ],

    stores: ['Demos'],

    refs: [
        {
            ref     : 'main',
            selector: 'mainview',
            autoCreate: true,
            xtype   : 'mainview'
        },
        {
            ref     : 'toolbar',
            selector: '#mainNavigationBar'
        },
        {
            ref     : 'sourceButton',
            selector: '#viewSourceButton'
        },
        {
            ref     : 'sourceOverlay',
            selector: 'sourceoverlay',
            xtype   : 'sourceoverlay',
            autoCreate: true
        },
        {
            ref     : 'navigation',
            selector: '#mainNestedList'
        },
        {
            ref : 'viewport',
            selector: 'viewport'
        }
    ],

    init: function() {
        this.control({
            '#mainNestedList': {
                leafitemtap: this.onLeafTap,
                back: this.onBack
            },

            '#viewSourceButton': {
                tap: this.onSourceButtonTap
            }
        });
    },

    onBack: function() {
        this.getSourceButton().setHidden(true);
    },

    onLeafTap: function(list, index) {
        if (this.mainAnimating) {
            return false;
        }

        var //navigation = this.getNavigation(),
            mainView = this.getMain(),
            mainLayout = mainView.getLayout(),
            record = list.getStore().getAt(index),
            viewTitle = record.get('text'),
            viewName = record.get('view') || viewTitle,
            xtype = viewName.toLowerCase() + 'view',
            getter = 'get' + Ext.String.capitalize(viewName),
            //source = this.getSourceButton(),
            profile = this.getProfile(),
            animationRecord = record.get('animation'),
            card, initialAnimation;


        //this.initialAnimation = initialAnimation = this.initialAnimation || mainLayout.getAnimation();

        if (!viewName.length) {
            return;
        }

        if (!this.hasRef(viewName)) {
            this.getView(viewName, {
                profile: profile
            });
            this.addRef({
                ref       : viewName,
                selector  : xtype,
                xtype     : xtype,
                autoCreate: true
            });
        }

        card = this[getter]();

        //navigation.setDetailCard(card);

        if (animationRecord) {
            mainLayout.setAnimation(animationRecord);
            // TODO: Temporary measure until more asynchronous Classes are ready
            /*if (Ext.os.name != 'Android') {
                mainLayout.getAnimation().getOutAnimation().setOnEnd(Ext.Function.bind(function() {
                    Ext.getBody().dom.style.pointerEvents = 'auto';
                }, this));
            }*/
        }
        else {
            /*mainLayout.setAnimation(initialAnimation);
            // TODO: Temporary measure until more asynchronous Classes are ready
            if (Ext.os.name != 'Android') {
                mainLayout.getAnimation().getOutAnimation().setOnEnd(Ext.Function.bind(function() {
                    Ext.getBody().dom.style.pointerEvents = 'auto';
                }, this));
            }*/
        }

        // TODO: Temporary measure until more asynchronous Classes are ready
        if (Ext.os.name != 'Android') {
            Ext.getBody().dom.style.pointerEvents = 'none';
        }

        this.getToolbar().setTitle(viewTitle);

        if (card.setProfile) {
            card.setProfile(profile);
        }
        //source.setHidden(false);
    },

    mainAnimating: false,

    onSourceButtonTap: function() {
        var overlay = this.getSourceOverlay(),
            filename = this.getMain().getActiveItem().ref;

        overlay.show();
        overlay.mask('Loading', null, true);

        Ext.Ajax.request({
            url: 'app/view/' + filename + '.js',
            scope: this,
            callback: this.onSourceLoad
        });
    },

    onSourceLoad: function(request, success, response) {
        var overlay = this.getSourceOverlay();
        overlay.setHtml(response.responseText);
        overlay.unmask();
    },

    updateProfile: function(profile) {
        // getMain to initialize...
        this.getMain();
        var navigation = this.getNavigation(),
            toolbar;
        switch (profile) {
            case 'desktop':
            case 'tablet':
                navigation.setDetailContainer(this.getMain());
                break;

            case 'phone':
                toolbar = navigation.getToolbar();
                toolbar.add({
                    xtype : 'button',
                    id: 'viewSourceButton',
                    hidden: true,
                    align : 'right',
                    ui    : 'action',
                    action: 'viewSource',
                    text  : 'Source'
                });
                break;
        }
    }
});
