(function() {
  module.exports = function(req, res) {
    return res.render('measure', {
      env: env,
      title: "A New Recipe"
    });
  };

}).call(this);

/*
//@ sourceMappingURL=measures.js.map
*/