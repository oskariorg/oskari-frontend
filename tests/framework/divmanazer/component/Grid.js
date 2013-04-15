// Might need refactoring
describe.only('Grid component', function() {
    var user = {}, service = {}; 

    service.tests = function() {
        // set environment for each test case
        service.init();

        describe('initialization', function() {
            it('should be defined', function() {
                expect(service.grid).to.be.ok();
            });

            it('should be found in DOM', function() {
                service.elementExists(jQuery('.oskari-grid'));
            });

            it('should have a column selector in DOM', function() {
                service.elementExists(jQuery('.column-selector'));
            });
        });

        describe('menu selector', function() {
            it('should disappear when clicking icon-menu button', function() {
                service.shouldBeVisible(jQuery('.column-selector'));
                user.clickElement(jQuery('.icon-menu'));
                service.shouldBeHidden(jQuery('.column-selector'));
            });
    
            it('should not disappear when clicking column checkbox', function() {
                service.shouldBeVisible(jQuery('.column-selector'));

                service.checkboxShouldNotBeChecked(jQuery('.column-selector').find('#column0'));
                service.checkboxShouldBeChecked(jQuery('.column-selector').find('#column1'));
                service.shouldContainText(jQuery('.oskari-grid thead tr th a').first(), 'column1')
                
                // show first column also
                user.clickElement(jQuery('.column-selector #column0'));

                service.checkboxShouldBeChecked(jQuery('.column-selector').find('#column0'));
                service.shouldContainText(jQuery('.oskari-grid thead tr th a').first(), 'column0')

                service.shouldBeVisible(jQuery('.column-selector'));
            });
        });
    };





    //////////////////////////
    // environment settings //
    //////////////////////////

    service.init = function() {
        beforeEach(service.before);
        afterEach(service.after);
    }
    // Init - beforeEach
    service.before = function() {
        var me = this;
        var data = [
            {'column0': 0, 'column1':1,'column2':2,'column3':3},
            {'column0': 00, 'column1':11,'column2':22,'column3':33},
            {'column0': 000, 'column1':111,'column2':222,'column3':333},
            {'column0': 0000, 'column1':1111,'column2':2222,'column3':3333},
            {'column0': 00000, 'column1':11111,'column2':22222,'column3':33333}
        ];

        // variables
        service.gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
        service.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid', 'Grid test');
        service.visibleFields = ['column1','column2','column3'];

        service.gridModel.addData(data[0]);
        service.gridModel.addData(data[1]);
        service.gridModel.addData(data[2]);
        service.gridModel.addData(data[3]);
        service.gridModel.addData(data[4]);

        service.grid.setDataModel(service.gridModel);    
        service.grid.setColumnUIName('__featureName', 'featureNameAll');

        service.grid.setVisibleFields(service.visibleFields);
        service.grid.setColumnSelector(true);
        service.grid.setResizableColumns(true);

        service.grid.renderTo(jQuery('body'));

    };

    // clear - afterEach
    service.after = function() {
        jQuery('body').children().remove();
        delete service.gridModel;
        delete service.grid;
        delete service.visibleFields;
    };



    ///////////////////////
    // service functions //
    ///////////////////////

    service.elementExists = function($element) {
        expect($element.length).to.equal(1);

    };
    service.shouldBeVisible = function($element) {
        expect($element.css('visibility')).to.equal('visible');
    };
    service.shouldBeHidden = function($element) {
        expect($element.css('visibility')).to.equal('hidden');
    };
    service.checkboxShouldBeChecked = function($element) {
        expect($element.prop('checked')).to.equal(true);
    }
    service.checkboxShouldNotBeChecked = function($element) {
        expect($element.prop('checked')).to.equal(false);
    }
    service.shouldContainText = function($element, text) {
        expect($element.text()).to.equal(text);
    }



    ////////////////////
    // user actions   //
    ////////////////////

    user.clickElement = function(element) {
        expect(element.length).to.equal(1);
        element.click();
    }

    // run tests!
    service.tests();
});