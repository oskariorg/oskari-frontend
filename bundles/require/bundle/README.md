
Oskari 2.0
======

New features in this release

- Oskari as require (AMD) module plugin
- new simplified more terse Class API
- good defaults to most class API methods
- simplified bundle, instance, flyout, event, require class declarations
- simplified request handler declarations


# requirejs.org (AMD) compatibility 
 
 
 ```
 define(["oskari"], function(Oskari) {
 	
 	
 }
 
 ```
 
 
# defining a class 

```
 define(["oskari"], function(Oskari) {
 	
 	return Oskari.cls("My.Class");
 	
 }
 
 ```

# defining a class' methods 

```
 define(["oskari"], function(Oskari) {
 	
 	return Oskari.cls().methods(
 	  {
 	     myMemberFunc: function() {
 	    	return "Hello";
 	    }
 	  });
 	
 }
 
 ```
 
 
# defining a named class with methods 

```
 define(["oskari"], function(Oskari) {
 	
 	return Oskari.cls('My.Class').methods(
 	  {
 	     myMemberFunc: function() {
 	    	return "Hello";
 	    }
 	  });
 	
 }
 
 ```
 
# defining a named class with constructor and methods 

```
 define(["oskari"], function(Oskari) {
 	
 	return Oskari.cls('My.Class', function(arg1) { this.arg = arg1; /* constructor */ },
 	  {
 	     myMemberFunc: function() {
 	    	return "Hello";
 	    }
 	  });
 	
 }
 
 ```

# instantiating a class  

```
 define(["oskari"], function(Oskari) {
 	
 	var  MyClass = Oskari.cls().methods(
 	  {
 	     myMemberFunc: function() {
 	    	return "Hello";
 	    }
 	  });
 	  
 	var myClassInstance = MyClass.create();
 	
 }
 
 ```

# instantiating a named class  

```
 define(["oskari"], function(Oskari) {
 	
 	var myClassInstance = Oskari.cls('My.Class').create('arg1');
	
 	
 }
 
 ```
 
 
# inheriting from a (named) superclass 

```
 define(["oskari"], function(Oskari) {
 	
 	return Oskari.cls("My.Class").
		extend("Oskari.userinterface.extension.EnhancedFlyout").
		methods({
 		
 		startPlugin : function() {
 		    
 		    this.getEl().append('Hello World');	
 		
 		},
 		stopPlugin: function() {
 		    
 		    this.getEl().empty();
 		    
 		}
 		
 	});
		
 	
 }
 
 ``` 

# defining a flyout as a bundle instance visualisation


./Flyout.js :
 
```
 define(["oskari"], function(Oskari) {
 	
 	return Oskari.cls().
 	  extend("Oskari.userinterface.extension.EnhancedFlyout").
 	  methods({
 		
 		startPlugin : function() {
 		    
 		    this.getEl().append('Hello World');	
 		
 		},
 		stopPlugin: function() {
 		    
 		    this.getEl().empty();
 		    
 		},
 		
 		visualiseMapMove : function(event) {
 			
 			this.getEl().append('MapMoved');
 			
 		}
 		
 	});
 	
 }
 
 ```

# defining a extension bundle instance class 

 ./instance.js :
 
```
 define(["oskari", "./Flyout"], function(Oskari, MyFlyout) {
 	
 	return Oskari.extensionCls().methods({
 		
 		startPlugin : function() {
 			
 			this.setFlyout( MyFlyout.create(this,{ title: 'Hello' }) ); /* instance, locale as parameters */
 			this.setDefaultTile('Hello');
 		},
 		stopPlugin: function() {
 			
 		}
 		
 	});
 	
 }
 
 ```


# defining a extension bundle class

 ./bundle.js : 

```
 define(["oskari",'./instance.js'], function(Oskari, MyExtension) {
 	
 	return Oskari.bundleCls("My.ExtensionBundleClass").methods({
 	
 		create: function() {
 			return MyExtension.create('extensioninstancename', { locale: 'this is locale for the extension' });
 			   /* instancename, locale as parameters */ 
 		}
 	});
 	
 }
 
 ```

# registering a extension bundle instance to listen to events 

 ./instance.js :
 
```
 define(["oskari", "./Flyout"], function(Oskari, MyFlyout) {
 	
 	return Oskari.extensionCls().methods({
 		
 		startPlugin : function() {
 			
 			this.setFlyout( MyFlyout.create(this,{ title: 'Hello' }) );
 			this.setDefaultTile('Hello');
 		},
 		stopPlugin: function() {
 			
 		}
 		
 	}).events( {
 	
 		'AfterMapMoveEvent' : function(event) {
 		
 			this.getFlyout().visualiseMapMove(event);
 		}
 	});
 	
 }
 
 ```

# notifying events

Notification (within aderived class method of Flyout or Instance ).
Method creates an instance of event class and posts notification to any listeners registered to the event.

```
this.notify('sample.SampleEvent','Something or other happened');

```


# issuing requests

Issuing a request (within aderived class method of Flyout or Instance )
Method creates an instance of request class and send request to THE registered request handler - if any.

```
var responseFromHandler =
  this.issue('sample.SampleRequest','Hello');

```

 
# defining an event class

Events shall be used for inter-bundle communications.
Event class must be included by some part of code. Event listeners use event identifiers to enable
 loose coupling of bundles and code.
 
The parameter to eventCls() method is the event identifier followed by optional constructor and methods.


```

define(["oskari"], function(Oskari) {

	return Oskari.eventCls("sample.SampleEvent", function(message) {
		this.message = message;
	}, {
		getMessage : function() {
			return this.message;
		}
	});

});

```

# defining a request class

Requests are used mostly in inter-bundle communications. Request classes must be
included by the request handler module.

The parameter to requestCls() method is the request identifier followed by optional constructor and methods.

```

define(["oskari"], function(Oskari) {

	return Oskari.requestCls("sample.SampleRequest", function(Message) {
		this._Message = Message;
	}, {
		getMessage : function() {
			return this._Message;
		}
	});

});


```
 
# registering a extension bundle instance as a request handler

Request class must be included in handler. Client uses request identifier to enable
 loose coupling of bundles and code.  

 ./instance.js :
 
```
 define(["oskari", "./Flyout",'./SampleRequest'], function(Oskari, MyFlyout) {
 
 	
 	Oskari.requestCls("sample.SampleRequest", function(Message) {
		this._Message = Message;
	}, {
		getMessage : function() {
			return this._Message;
		}
	});
 
 	
 	return Oskari.extensionCls().requests( {
 		"sample.SampleRequest", function(request) {
 		
 		
 			return "ResponseFromHandler";
 		}
 	
 	});
 	
 }
 
 ```

# setting localization for a bundle instance

```
define(["oskari", "i18n!./nls/locale"], function(Oskari, locale) {

    return Oskari.bundleCls().methods({
        create : function() {

            var extensionInstance = Oskari.extensionCls().methods({

                startPlugin : function() {
                	                	
                	var flyout = 
                		Oskari.cls().extend("Oskari.userinterface.extension.EnhancedFlyout").
                    		methods({

                        	startPlugin : function() {
                            	var el = this.getEl(), 
                            		msg = this.getLocalization().message
                            	
                            	el.append(msg);

                        	}
                    	}).create(this, locale.flyout); /* instance and locale as parameter to constructor */
                		

                    this.setFlyout(flyout);
                    this.setDefaultTile(locale.tile.title);

                }
            }).create('i18nextension',locale); /* instancename, locale as parameter to constructor */
            
            return extensionInstance;

        }
    });


});

```

# a simple bundle definition 

```

define(["oskari", "./instance"], function(Oskari, instanceCls) {

    return Oskari.bundleCls().
    	methods({
        	create : function() {
            	return instanceCls.create('require'); /* bundle instance identifier as parameter */
        	}
    	});

});

```

# referencing, instantiating and starting a bundle instance

```
require("_bundles_/framework/bundle/divmanazer/bundle"],function(divmanazer) {

	var bi = divmanazer.start();
	
	
	/* bi.stop() */
	

});

```


# sample app startup 

```
var lang = 'fi';
require.config({

    /* the base is set to requirejs lib to help requiring 3rd party libs */
    "baseUrl" : "../../../libraries/requirejs/lib",

    /* some path shortcuts to ease declarations */
    paths : {
        _libraries_ : '../../../libraries',    	
        _bundles_ : '../../../bundles',
        _applications_ : '../../../applications',
        _resources_ : '../../../resources'
    },
    config : {
        i18n : {
            locale : lang /* require i18n locale */
        }
    }

});

/* using provided jquery in this demo */
define("jquery", [], function() {
    return jQuery;
});

/* loading base requirements */
require(["jquery", "oskari", "domReady!"],
  function($, Oskari) {
    require(["json!_applications_/oskari2/nextgenbaseonly/config.json", 
    	"_bundles_/oskari/bundle/map-openlayers/bundle"], 
    	function(appConfig) {

        Oskari.setLang(lang); /* oskari locale */
        Oskari.setConfiguration(appConfig);

        require(["_bundles_/oskari/bundle/mapfull-openlayers/bundle", 
        	"_bundles_/framework/bundle/divmanazer/bundle"], 
        	function(mapfull, divmanazer) {

            mapfull.start();
            divmanazer.start();

        });
    })
});

```


# Accessing Oskari with compatibility loader enabled 
 
 ```
 define(["oskari","oskariloader"], function(Oskari) {
 	
 	
 }
 
 ```