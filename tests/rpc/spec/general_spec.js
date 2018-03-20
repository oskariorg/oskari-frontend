describe("General", function() {

    beforeEach(function(done) {
        channel.onReady(function() {
            //channel is now ready and listening.
            done();
        });
    });

   it("is supported", function(done) {
        channel.isSupported(function(blnSupported) {
            expect(blnSupported).toBe(general.IsSupported);
            channel.log('Client is supported.')
            done();
        });
    }); 

    it("has expected Oskari version", function(done) {
        channel.getInfo(function(oskariInfo) {
            expect(oskariInfo.version).toBe(general.ExpectedOskariVersion);
            channel.log('Oskari version is', oskariInfo.version, '/', general.ExpectedOskariVersion);
            done();
        });
    });

    it("has expected RPC version", function(done) {
        channel.getInfo(function(oskariInfo) {
            expect(OskariRPC.VERSION).toBe(general.ExpectedRPCVersion);
            channel.log('RPC version is', OskariRPC.VERSION, '/', general.ExpectedRPCVersion);
            done();
        });
    });

    it("has expected SRS", function(done) {
        channel.getInfo(function(oskariInfo) {
            expect(oskariInfo.srs).toBe(general.srsName);
            channel.log('SRS: ', oskariInfo.srs, '/', general.srsName, oskariInfo);
            done();
        });
    });

});
