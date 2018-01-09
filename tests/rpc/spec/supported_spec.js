describe('Get Supported', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
            done();
        });
    });

    all("Supported functions",
        supportedFunctions,
            function(supportedFunctions, done) {
                channel.getSupportedFunctions(function(data) {
                    expect(data[supportedFunctions]).toBe(true);
                    done();
                });
            }
    );

    all("Supported requests",
        supportedRequests,
            function(supportedRequests, done) {
                channel.getSupportedRequests(function(data) {
                    expect(data[supportedRequests]).toBe(true);
                    done();
                });
            }
    );

    all("Supported events",
        supportedEvents,
            function(supportedEvents, done) {
                channel.getSupportedEvents(function(data) {
                    expect(data[supportedEvents]).toBe(true);
                    done();
                });
            }
    );

});
