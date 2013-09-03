define(["oskari"], function(Oskari) {
    return Oskari.bundleCls().methods({
        create : function() {
            return Oskari.extensionCls().methods({
                startPlugin : function() {
                    this.setFlyout(Oskari.flyoutCls().methods({
                        startPlugin : function() {
                            this.getEl().append("require based 'extreme' implementation with no vars and nested anonymous classes");
                        }
                    }).create(this, {
                        "title" : "require (no-rules-no comments)"
                    }));
                    this.setDefaultTile("require-loc");
                }
            }).create('requireminloc');
        }
    })
});