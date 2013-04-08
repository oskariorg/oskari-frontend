describe.only('FormInput UI component', function() {
    var formInput, testName = 'test_input';
 
    beforeEach(function() {
        formInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput', testName);
        jQuery('body').append(formInput.getField());
    });

    afterEach(function() {
        jQuery('div.oskarifield').remove();
    });

    describe('initialization', function() {
        it('should be defined', function() {
            expect(formInput).to.be.ok();
        });

        it('should be found in DOM', function() {
            var $oskariField = jQuery('div.oskarifield');
            expect($oskariField.length).to.equal(1);
        });

        it('should have a name visible in DOM', function() {
            var $name = jQuery('div.oskarifield').find('input').attr('name');
            expect($name).to.be(testName);
        });
    });

    describe('validation', function() {
        it('should validate true', function() {
            var okValue = 'foobar123_-',
                isOk = false;

            formInput.setValue(okValue);
            isOk = formInput.checkValue();
            expect(isOk).to.be.ok();
        });

        it('should validate false', function() {
            var falseValue = 'foobar123_-*',
                isFalse = true;

            formInput.setValue(falseValue);
            isFalse = formInput.checkValue();
            expect(isFalse).to.not.be.ok();
        });

        it('should validate true with a custom regex', function() {
            var okValue = 'swag123*',
                isOk = false,
                regex = /[\w\d\*]*/;

            formInput.setRegExp(regex);
            formInput.setValue(okValue);
            isOk = formInput.checkValue();
            expect(isOk).to.be.ok();
        });

        it('should validate false with a custom regex', function() {
            var falseValue = 'swag123{[-*',
                isFalse = true,
                regex = /[\w\d\*]*/;

            formInput.setRegExp(regex);
            formInput.setValue(falseValue);
            isFalse = formInput.checkValue();
            expect(isFalse).to.not.be.ok();
        })
    });

    describe('key bindings', function() {
        it('should bind to enter key press', function() {
            var cb = sinon.spy(),
                $oskariInputField = jQuery('div.oskarifield').find('input');

            formInput.bindEnterKey(cb);

            $oskariInputField.attr('value', 'foobar');
            var e = jQuery.Event("keypress", {which: 13});
            jQuery($oskariInputField).trigger(e);
            console.log(formInput._isEnterPress(e));
            expect(cb.called).to.be.ok();
        });
    });
});