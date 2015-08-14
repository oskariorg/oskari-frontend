// Might need refactoring
describe('Popup component', function() {
  var dialog;
  var titleText = 'title';
 
  beforeEach(function() {
    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    dialog.show(titleText, 'content');
  });

  afterEach(function() {
    dialog.close(true);
  });
  
  it('should be defined', function(){
    expect(dialog).to.be.ok();
  });

  it('should be found in DOM', function(){
    var popup = jQuery('div.divmanazerpopup');
    expect(popup.length).to.equal(1);
  });

  it('should have a title', function() {
    var popup = jQuery('div.divmanazerpopup');
    var title = popup.find('h3').html();
    expect(title).not.to.be(null);
    expect(title).to.equal('title'); // dialog.getTitle()
  });

});