define([
    "./module"
], function(divmanazer) {

    /* DIVManazer debugs */
    divmanazer.debug_start = divmanazer.start;
    divmanazer.start = function (instanceid) {
        console.log('start called with instanceid', instanceid);
        this.debug_start(instanceid);
    }
    
    console.log('Oskari extended with debugs!');

    return divmanazer;
});