var request = require('supertest');
var should = require('should');

describe("RunningController", function() {
  describe("捐赠接口", function() {
    it('请先激活钱包', function(done) {
      request(sails.hooks.http.app)
        .get("/Vigorous/running/donateStep?todayStep=10000&donateStep=8000")
        .end(function(err, results) {
          should(results.text).be.exactly("请先激活钱包");
          done();
        })
    })
  })
})