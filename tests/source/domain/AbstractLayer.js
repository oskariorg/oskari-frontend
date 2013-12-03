describe.only('AbstractLayer', function() {

    var layer = null;
    var methods = ['Name', 'Description', 'InspireName', 'OrganizationName'];
	var testStr = 'testing 123';
 
    beforeEach(function() {
        layer = Oskari.clazz.create('Oskari.mapframework.domain.AbstractLayer');
    });

    describe('set name/desc/inspire/organization', function() {

    	describe('as strings', function() {

	        it('get should match set', function() {
				for(var i =0; i < methods.length; ++i) {
		        	// call set
		        	set(layer, methods[i], testStr);
		        	var value = get(layer, methods[i]);
		            expect(value).to.be(testStr);
	    		}
	        }); 
	    }); 

    	describe('as objects', function() {

	        it('get should match set with default language', function() {
				Oskari.setLang('en');
				for(var i =0; i < methods.length; ++i) {
		        	// call set
		        	set(layer, methods[i], {
		        		"en" : testStr
		        	});
		        	var value = get(layer, methods[i]);
		            expect(value).to.be(testStr);
	    		}
	        }); 


        	it('get should match set with language changed on runtime', function() {
				Oskari.setLang('en');
				for(var i =0; i < methods.length; ++i) {
		        	// call set
		        	set(layer, methods[i], {
		        		"fi" : testStr + "fi",
		        		"en" : testStr
		        	});
					Oskari.setLang('fi');
		        	var value = get(layer, methods[i]);
		            expect(value).to.be(testStr + "fi");
	    		}
	        }); 

        	it('get should match set with language parameter', function() {
				Oskari.setLang('en');
				for(var i =0; i < methods.length; ++i) {
		        	// call set
		        	set(layer, methods[i], {
		        		"fi" : testStr + "fi",
		        		"en" : testStr
		        	});
		        	var value = get(layer, methods[i]);
		            expect(value).to.be(testStr);

		        	var valueFi = get(layer, methods[i], "fi");
		            expect(valueFi).to.be(testStr + "fi");
	    		}
	        }); 
	    }); 

    });

    describe('set localization', function() {

        it('should override only defined attributes', function() {
        	var testingOverride = 'testing something different';
        	layer.setName(testingOverride);
        	layer.setDescription(testingOverride);
        	layer.setLocalization({
        		"fi" : {
        			"inspire" : testStr,
        			"subtitle" : testStr
        		},
        		"en" : {
        			"inspire" : testStr,
        			"subtitle" : testStr
        		}
        	});
            expect(layer.getName()).to.be(testingOverride);
            expect(layer.getDescription()).to.be(testStr);
            expect(layer.getInspireName()).to.be(testStr);
            expect(layer.getOrganizationName()).to.be(null);
        }); 
    });    	

// helpers
    function set(layer, method, value) {
		var setter = 'set' + method;
		layer[setter](value); 
    }
    function get(layer, method, parameter) {
    	var getter = 'get' + method;
    	return layer[getter](parameter);
    }

});