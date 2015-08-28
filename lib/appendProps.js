'use strict';

var fs = require('fs');
var _ = require('lodash');
var csv = require('csv-parser');

function appendProps(features, csvFile, pickProps, callback) {
  if (typeof pickProps === 'function') {
    callback = pickProps;
    pickProps = [];
  }

  var featureArray = [];

  function buildFeature(row) {
    var geom = matchGeom(features, row);

    if (geom) return mergeData(featureArray, geom, row, pickProps);

    return;
  }

  function onErr(err) {
    return callback(err);
  }

  function onEnd() {
    return callback(null, featureArray);
  }

  return fs.createReadStream(csvFile)
    .pipe(csv())
    .on('data', buildFeature)
    .on('error', onErr)
    .on('end', onEnd);

}

function matchGeom(features, row) {
  return _.find(features, function(f) {
    return f.properties.GEOID === row['GEO.id2'];
  });
}

function mergeData(featureArray, geom, row, props) {
  var props = _.pick(row, props);
  geom.properties = _.merge(geom.properties, props);

  return featureArray.push(geom);
}

module.exports = appendProps;
