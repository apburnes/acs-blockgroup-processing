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

  fs.createReadStream(csvFile)
    .pipe(csv())
    .on('data', function(row) {
      var geom = _.find(features, function(f) {
         return f.properties.GEOID === row.GEOID;
      });

      var props = _.pick(row, pickProps);

      geom.properties = _.merge(geom.properties, props);

      return featureArray.push(geom);
    })
    .on('error', function(err) {
      callback(err);
    })
    .on('end', function() {
      callback(null, featureArray);
    });

}

module.exports = appendProps;
