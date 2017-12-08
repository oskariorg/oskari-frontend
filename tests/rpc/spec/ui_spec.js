describe('Ui', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
            channel.resetState(function() {
                counter = 0;
                done();
            });
        });
    });

    afterEach(function() {
        // Spy callback.
        expect(counter).toEqual(1);
    });

    describe('Show a progress spinner', function(){

        it("Adds progress spinner", function(done) {
            channel.postRequest('ShowProgressSpinnerRequest', [true]);
            channel.log('ShowProgressSpinnerRequest true done.');
            counter++;
            done();
        });

        it("Removes progress spinner", function(done) {
            channel.postRequest('ShowProgressSpinnerRequest', [false]);
            channel.log('ShowProgressSpinnerRequest false done.');
            counter++;
            done();
        });
    });

    describe('Show or hide infobox', function(){

        it("Shows infobox", function(done) {
            // Adds custom infobox.
            channel.postRequest('InfoBox.ShowInfoBoxRequest', myInfoBox);
            channel.log("ShowInfoBoxRequest done.");
            counter++;
            done();
        });

        it("Hides infobox", function(done) {
            // Hides infobox using ID.
            //InfoBoxEvent occurs only if infobox is visible before HideInfoBoxRequest.
            channel.postRequest('InfoBox.HideInfoBoxRequest', [infoboxId]);
            channel.log("HideInfoBoxRequest done.");
            counter++;
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
                            counter++;
                            done();
                        });
                    });
                    
                    // toggle off repeats the same call
                    it("toggles off", function(done) {
                        channel.sendUIEvent([UIEvent], function(data) {
                            expect(data).toBe(true);
                            channel.log('sendUIEvent: ', data);
                            counter++;
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
                    counter++;
                    done();
                });
            }
        );
    });

});

