'use strict';

var _ = require('lodash');
var path = require('path');
var expect = require('chai').expect;
var shapefile = require('shapefile');
var geojsonhint = require('geojsonhint');

var appendProps = require('../lib/appendProps');

var shpFile = path.join(__dirname, './fixtures/block_groups.shp');
var csvFile = path.join(__dirname, './fixtures/acs_table.csv');

var appendedProps = [
  'ALAND',
  'AWATER',
  'BLKGRPCE',
  'COUNTYFP',
  'FUNCSTAT',
  'GEOID',
  'INTPTLAT',
  'INTPTLON',
  'MTFCC',
  'NAMELSAD',
  'STATEFP',
  'TRACTCE',
  'HD01_VD01',
  'HD02_VD01',
  'HD01_VD02',
  'HD02_VD02',
  'HD01_VD03',
  'HD02_VD03',
  'HD01_VD04',
  'HD02_VD04',
  'HD01_VD05',
  'HD02_VD05',
  'HD01_VD06',
  'HD02_VD06',
  'HD01_VD07',
  'HD02_VD07',
  'HD01_VD08',
  'HD02_VD08',
  'HD01_VD09',
  'HD02_VD09',
  'HD01_VD10',
  'HD02_VD10'
];

var pickedProps = appendedProps.slice(0, 13);
var pickProp = 'HD01_VD01';

var featureCount = 2505;

describe('Append ACS properties to geometry via GEOID', function() {
  var features;

  before(function(done) {
    shapefile.read(shpFile, function (err, data) {
      features = data.features;
      done(err);
    });
  });

  after(function(done) {
    features = null;
    done();
  });

  it('should append csv row to selected feature properties from an array of features', function(done) {
    appendProps(features, csvFile, function(err, data) {
      var after = _.after(data.length, function() {
        return done(err);
      });

      expect(data.length).to.be.equal(featureCount);

      _.forEach(data, function(feature) {
        expect(geojsonhint.hint(feature)).to.be.empty;
        expect(feature.properties).to.have.any.keys(appendedProps);
        return after();
      });
    });
  });

  it('should append csv row to selected feature properties with specified csv row property', function(done) {
    appendProps(features, csvFile, pickProp, function(err, data) {
      var after = _.after(data.length, function() {
        return done(err);
      });

      expect(data.length).to.be.equal(featureCount);

      _.forEach(data, function(feature) {
        expect(geojsonhint.hint(feature)).to.be.empty;
        expect(feature.properties).to.have.any.keys(pickedProps);
        return after();
      });
    });
  });
});

