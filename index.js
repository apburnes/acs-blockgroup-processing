'use strict';

var turf = require('turf');

function createRandomPolygonPoints(number, polygon, callback) {
  if (this instanceof createRandomPolygonPoints) {
    return new createRandomPolygonPoints(number, polygon, callback);
  }

  if (typeof polygon === 'function') {
    callback = polygon;
    polygon = turf.random('polygon');
  }

  var points = [];
  var bbox = turf.extent(polygon);
  var count = number;

  for (var i = 0; i <= number; i++) {
    if (i === number) {
      return callback(turf.featurecollection(points));
    }

    var point = turf.random('point', 1, { bbox: bbox });

    if (turf.inside(point.features[0], polygon.features[0]) === false) {
      i = i - 1;
    }

    if (turf.inside(point.features[0], polygon.features[0]) === true) {
      points.push(point.features[0]);
    }
  }

}

module.exports = createRandomPolygonPoints;
