'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var shapefile = require('shapefile');

function convertShp(filepath, omitProps, callback) {
  if (typeof omitProps === 'function') {
    callback = omitProps;
    omitProps = [];
  }

  var reader = shapefile.reader(filepath);
  var shapes = [];

  function updateFeature(err, rec) {
    if (err) {
      return callback(err);
    }

    if (Object.keys(rec).length === 0) {
      return reader.close(function() {
        return callback(null, shapes);
      });
    }

    if (Object.keys(rec).length > 0 ) {
      if (omitProps.length > 0) {
        var newProps = _.omit(rec.properties, omitProps);
        var feature = _.assign(rec, { properties: newProps });

        shapes.push(feature);
      }
      else {
        shapes.push(rec);
      }

      return reader.readRecord(updateFeature);
    }
  }

  return reader.readHeader(function(err, header) {
    if (err) return callback(err);

    return reader.readRecord(updateFeature)
  });
}

module.exports = convertShp;
