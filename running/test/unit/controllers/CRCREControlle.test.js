var request = require('supertest');
var should = require('should');

describe("CRCREContorller", function() {

  //公益项目查询接口
  describe("CRCREimformation()", function() {

    it('CRCREimformation()', function(done) {
      request(sails.hooks.http.app)
        .get("/Vigorous/CRCRE/CRCREimformation")
        .end(function(err, results) {
          should(results.text).be.exactly("Not find");
          done();
        })
    })
  })


  //公益组织查询接口
  it('organizationImformation()', function(done) {
    request(sails.hooks.http.app)
      .get("/Vigorous/CRCRE/organizationImformation")
      .end(function(err, results) {
        should(results.text).be.exactly("Not find");
        done()
      })
  })
})