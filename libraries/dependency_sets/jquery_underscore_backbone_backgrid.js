/*
 * The Oskari 1.0 loader implementation does not allow loading libraries in a specific order.
 * This file is for loading backgrid and its dependencies in an ordered fashion.
 * Note that backbone/comp.js already has backbone dependencies concatenated into it.
 */
$.getScript("/Oskari/libraries/backbone/comp.js", function() {
    $.getScript("/Oskari/libraries/backgrid-0.3.5/lib/backgrid.js", function() {
    });
});
