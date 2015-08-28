'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var expect = require('chai').expect;
var geojsonhint = require('geojsonhint');
var pointify = require('../lib/pointifyBlocks');

var sampleFeatures = require('./fixtures/block_groups_with_acs');

var valueProps = [
  'HD01_VD02',
  'HD01_VD03',
  'HD01_VD04',
  'HD01_VD05',
  'HD01_VD06',
  'HD01_VD07',
  'HD01_VD08',
  'HD01_VD09',
  'HD01_VD010'
];

describe('pointify', function() {
  it('should create random points with individual value properties within each block group', function(done) {
    pointify(sampleFeatures, valueProps, function(err, data) {
      var after = _.after(data.length, function() {
        return done(err);
      });

      expect(data).to.be.an('array');
      expect(data.length).to.be.above(16000);

      return _.map(data, function(item) {
        expect(geojsonhint.hint(item)).to.be.empty;
        expect(item.properties).to.have.property('race');
        return after();
      });
    });
  });
});
