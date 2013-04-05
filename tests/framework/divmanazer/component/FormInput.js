describe('FormInput UI component', function() {
    var formInput;
 
    beforeEach(function() {
        formInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
    });

    afterEach(function() {
        formInput.setValue('');
    });

    describe('initialization' , function() {
        it('should be defined', function(){
            expect(formInput).to.be.ok();
        });

        it('should be found in DOM', function(){
            var $oskariField = jQuery('div.oskarifield');
            expect($oskariField.length).to.equal(1);
        });

        it('', function() {

        });
    });

    describe('validation', function() {
        it('should validate true', function() {
            var okValue = 'foobar123_-*',
                isOk = false;

            formInput.setValue(okValue);
            isOk = formInput.checkValue();
            expect(isOk).to.be.ok();
        });

        it('should validate false', function() {
            var falseValue = 'lolollol+**++lol',
                isFalse = true;

            formInput.setValue(falseValue);
            isFalse = formInput.checkValue();
            expect(isFalse).not.to.be.ok();
        });

        it('should validate ok with a custom regex', function() {
            var okValue = 'swag123*',
                isOk = false,
                regex = /[\w\d\*]*/;

            formInput.setRegExp(regex);
            formInput.setValue(okValue);
            isOk = formInput.checkValue();
            expect(isOk).to.be.ok();
        });

        it('should validate false with a custom regex', function() {
            var falseValue = 'swag123---*',
                isFalse = true,
                regex = /[\w\d\*]*/;

            formInput.setRegExp(regex);
            formInput.setValue(falseValue);
            isFalse = formInput.checkValue();
            expect(isFalse).not.to.be.ok();
        })
    });
});