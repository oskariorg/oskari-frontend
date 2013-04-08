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
        });

        it('should validate without errors', function() {
            var okValue = 'foobar123_-',
                errors;

            formInput.setValue(okValue);
            errors = formInput.validate();
            expect(errors.length).to.be(0);
        });

        it('should have errors on empty input', function() {
            var errorValue = '',
                errors;

            formInput.setRequired(true);
            formInput.setValue(errorValue);
            errors = formInput.validate();
            expect(errors.length).to.be(1);
        })
    });

    describe('key bindings', function() {
        var cb, $oskariInputField;

        beforeEach(function() {
            cb = sinon.spy();
            $oskariInputField = jQuery('div.oskarifield').find('input');
        });

        afterEach(function() {
            cb = null;
            $oskariInputField = null;
        });

        it('should bind to enter key press', function() {
            formInput.bindEnterKey(cb);
            expect(cb.callCount).to.be(0);

            $oskariInputField.attr('value', 'foobar');
            var e = jQuery.Event("keypress", {which: 13});
            jQuery($oskariInputField).trigger(e);

            expect(cb.callCount).to.be(1);
        });

        it('should bind to change event', function() {
            formInput.bindChange(cb, false);
            expect(cb.callCount).to.be(0);

            var e = jQuery.Event("change");
            jQuery($oskariInputField).trigger(e);

            expect(cb.callCount).to.be(1);
        });

        it('should bind to keyup event', function() {
            formInput.bindChange(cb, true);
            expect(cb.callCount).to.be(0);

            var e = jQuery.Event("keyup");
            jQuery($oskariInputField).trigger(e);

            expect(cb.callCount).to.be(1);
        })
    });
});