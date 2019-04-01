var request = require('supertest');
var should = require('should');

describe("CRCREContorller", function() {
  describe("CRCREimformation()", function() {
    it('CRCREimformation()', function(done) {
      request(sails.hooks.http.app)
        .get("/Vigorous/CRCRE/organizationImformation")
        .end(function(err, results) {
          should(results.text).be.exactly("ok");
          done();
        })
    })
  })
})