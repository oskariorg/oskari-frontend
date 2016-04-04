Polymer.require = function(deps, func) {
  require(deps, function() {
    Polymer(func.apply(this, arguments));
  });
};
