describe('Ui', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
            channel.resetState(function() {
                eventCounter = 0;
                done();
            });
        });
    });

    afterEach(function() {
        // Spy callback.
        expect(eventCounter).toEqual(1);
    });

    describe('Show a progress spinner', function(){

        it("Adds progress spinner", function(done) {
            channel.postRequest('ShowProgressSpinnerRequest', [true]);
            channel.log('ShowProgressSpinnerRequest true done.');
            eventCounter++;
            done();
        });

        it("Removes progress spinner", function(done) {
            channel.postRequest('ShowProgressSpinnerRequest', [false]);
            channel.log('ShowProgressSpinnerRequest false done.');
            eventCounter++;
            done();
        });
    });

    describe('Show or hide infobox', function(){

        it("Shows infobox", function(done) {
            // Adds custom infobox.
            channel.postRequest('InfoBox.ShowInfoBoxRequest', myInfoBox);
            channel.log("ShowInfoBoxRequest done.");
            eventCounter++;
            done();
        });

        it("Hides infobox", function(done) {
            // Hides infobox using ID.
            //InfoBoxEvent occurs only if infobox is visible before HideInfoBoxRequest.
            channel.postRequest('InfoBox.HideInfoBoxRequest', [infoboxId]);
            channel.log("HideInfoBoxRequest done.");
            eventCounter++;
            done();
        });
    });

    describe('Send UI event', function(){
        // Toggles coordinatetool visible.
        // Toggles the map's center crosshair.
        using("sendUIEvent",
            [
                    'coordinatetool',
                    'mapmodule.crosshair'
            ],
            function (UIEvent) {
                
                    it("toggles on", function(done) {
                        channel.sendUIEvent([UIEvent], function(data) {
                            expect(data).toBe(true);
                            channel.log('sendUIEvent: ', data);
                            eventCounter++;
                            done();
                        });
                    });
                    
                    // toggle off repeats the same call
                    it("toggles off", function(done) {
                        channel.sendUIEvent([UIEvent], function(data) {
                            expect(data).toBe(true);
                            channel.log('sendUIEvent: ', data);
                            eventCounter++;
                            done();
                        });
                    });
                }
        );
    });

    describe('Set cursor style', function(){

        all("Cursor style is visible",

                    cursorStyles
            ,
            function(cursorStyles, done) {
                // Sets the cursor style on map. The value can be any valid css cursor value. 
                // Not all possible values are supported by all browsers.
                channel.setCursorStyle([cursorStyles], function(data) {
                    channel.log('setCursorStyle: ', data);
                    eventCounter++;
                    done();
                });
            }
        );
    });

});
