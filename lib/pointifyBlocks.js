'use strict';

var _ = require('lodash');
var randomPoints = require('random-points-on-polygon');

function pointifyBlocks(features, valueProps, callback) {
  var denominator = 25;
  var allPoints = [];

  var done = _.after(features.length, function() {
    return callback(null, _.flatten(allPoints));
  });

  function buildPoints(feature, callback) {
    var points = [];
    var propertiesCount = Object.keys(feature.properties).length;

    var after = _.after(propertiesCount, function() {
      return callback(_.flatten(points));
    });

    return _.map(feature.properties, function(value, key) {
      var field = _.indexOf(valueProps, key);

      if (field > -1 && (value/denominator) > 1) {
        var count = value/denominator;
        var createdPoints = randomPoints(count, feature, {GEOID: feature.properties.GEOID, race: key});
        points.push(createdPoints);
      }

      return after();
    });
  }

  return _.forEach(features, function(feature) {
      return buildPoints(feature, function(bgPoints) {
        allPoints.push(bgPoints);
        return done();
      });
  });
}

module.exports = pointifyBlocks;
