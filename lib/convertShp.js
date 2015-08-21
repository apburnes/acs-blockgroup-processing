'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var shapefile = require('shapefile');

function convertShp(filepath, pickProps, callback) {
  if (typeof pickProps === 'function') {
    callback = pickProps;
    pickProps = [];
  }

  var reader = shapefile.reader(filepath);
  var shapes = [];

  function updateFeature(err, rec) {
    var newProps;

    if (err) {
      return callback(err);
    }

    if (Object.keys(rec).length === 0) {
      return reader.close(function() {
        return callback(null, shapes);
      });
    }

    if (Object.keys(rec).length > 0 ) {
      if (pickProps.length > 0) {
        newProps = _.pick(rec.properties, pickProps);
      }
      else {
        newProps = rec.properties;
      }

      var feature = _.assign(rec, { properties: newProps });

      shapes.push(feature);

      return reader.readRecord(updateFeature);
    }
  }

  return reader.readHeader(function(err, header) {
    if (err) return callback(err);

    return reader.readRecord(updateFeature)
  });
}

module.exports = convertShp;
