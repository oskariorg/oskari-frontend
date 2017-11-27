Oskari.clazz.define("Oskari.mapping.printout2.tools.TestTool",
    function ( ) {

}, {
    getName: function () {
        return "TestTool";
    },
    getElement: function () {
        return jQuery("<div><p>HELLLOOOOOOOOO</p></div>");
    }
}, {
    'extend' : ['Oskari.mapping.printout2.tools.AbstractTool'],
    'protocol' : ['Oskari.mapping.printout2.Tool']
});