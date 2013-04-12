// Might need refactoring
describe.only('Grid component', function() {
  var grid, titleText = 'title', user = {}, service={};
 
  beforeEach(service.init);


    describe('initialization', function() {
        it('should be defined', function() {
            expect(grid).to.be.ok();
        });

        it('should be found in DOM', function() {
            service.elementExists(jQuery('.oskari-grid'));
        });

        it('should have a column selector in DOM', function() {
            var $oskariGridSelector = jQuery('.column-selector');
            expect($oskariGridSelector.length).to.equal(1);
        });
    });

    describe('hide and show menu selector', function() {
        it('should hide column selector when clicking icon-menu button', function() {
            var $iconMenu = jQuery('.icon-menu');
            var $oskariGridSelector = jQuery('.column-selector');

            expect($oskariGridSelector.css('visibility')).to.equal('visible');
            user.clickElement($iconMenu);
            expect($oskariGridSelector.css('visibility')).to.equal('hidden');
        });

        it('should not hide column selector when clicking column checkbox', function() {
            var $iconMenu = jQuery('.icon-menu'),
                $oskariGridSelector = jQuery('.column-selector'),
                $oskariGrid = jQuery('.oskari-grid'),
                $firstColumnName = jQuery($oskariGrid.find('thead tr th a').get(0));


            expect($oskariGridSelector.css('visibility')).to.equal('visible');
            expect($oskariGridSelector.find('#row0').prop('checked')).to.equal(false);
            expect($oskariGridSelector.find('#row1').prop('checked')).to.equal(true);


            expect($firstColumnName.text()).to.equal('row1');
            
            user.clickElement($oskariGridSelector.find('#row0'));
            service.e
            expect($firstColumnName.text()).to.equal('row0');


            expect($oskariGridSelector.css('visibility')).to.equal('hidden');
        });

    });




//alustus paskaa

service.init = function() {
    var me = this;
    var data = [
        {'row0': 0, 'row1':1,'row2':2,'row3':3},
        {'row0': 00, 'row1':11,'row2':22,'row3':33},
        {'row0': 000, 'row1':111,'row2':222,'row3':333},
        {'row0': 0000, 'row1':1111,'row2':2222,'row3':3333},
        {'row0': 00000, 'row1':11111,'row2':22222,'row3':33333}
    ];

    var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
    gridModel.addData(data[0]);
    gridModel.addData(data[1]);
    gridModel.addData(data[2]);
    gridModel.addData(data[3]);
    gridModel.addData(data[4]);

    grid = Oskari.clazz.create('Oskari.userinterface.component.Grid', 'Grid test');

    grid.setDataModel(gridModel);    
    grid.setColumnUIName('__featureName', 'featureNameAll');

    var visibleFields = ['row1','row2','row3'];
    grid.setVisibleFields(visibleFields);
    grid.setColumnSelector(true);
    grid.setResizableColumns(true);

    grid.renderTo(jQuery('body'));

  });

  afterEach(function() {
        jQuery('body').children().remove();
    });

  service.elementExists = function($element) {
    expect($element.length).to.equal(1);

  }
  
  user.clickElement = function(element) {
    expect(element.length).to.equal(1);
    element.click();
  }

});