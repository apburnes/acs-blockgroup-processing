'use strict';

var _ = require('lodash');
var path = require('path');
var expect = require('chai').expect;
var geojsonhint = require('geojsonhint');
var convertShp = require('../lib/convertShp');

var blockGroups = path.join(__dirname, './fixtures/block_groups.shp');
var badBlockGroups = path.join(__dirname, './fixtures/not_a_shape.shp');
var origProps = [
  'STATEFP',
  'COUNTYFP',
  'TRACTCE',
  'BLKGRPCE',
  'GEOID',
  'NAMELSAD',
  'MTFCC',
  'FUNCSTAT',
  'ALAND',
  'AWATER',
  'INTPTLAT',
  'INTPTLON'
];
var pickedProps = origProps.slice(0, 5);
var featureCount = 2505;

describe('Converting a shapefile to geojson', function() {
  it('should convert a shapefile to an array of features and keep original the properties', function(done) {
    convertShp(blockGroups, function(err, features) {
      var after = _.after(features.length, function() {
        return done(err);
      });

      expect(features).to.be.an('array');
      expect(features.length).to.be.equal(featureCount);

      _.forEach(features, function(feature) {
        expect(geojsonhint.hint(feature)).to.be.empty;
        expect(feature.properties).to.have.keys(origProps)
        return after();
      });
    });
  });

  it('should convert a shapefile to an array of features and pick selected properties', function(done) {
    convertShp(blockGroups, pickedProps, function(err, features) {
      var after = _.after(features.length, function() {
        return done(err);
      });

      expect(features).to.be.an('array');
      expect(features.length).to.be.equal(featureCount);

      _.forEach(features, function(feature) {
        expect(geojsonhint.hint(feature)).to.be.empty;
        expect(feature.properties).to.have.keys(pickedProps)
        return after();
      });
    });
  });

  it('should reject with an invalid shapefile', function(done) {
    convertShp(badBlockGroups, function(err, features) {
      expect(err).to.be.instanceof(Error);
      done(features);
    });
  });
});
