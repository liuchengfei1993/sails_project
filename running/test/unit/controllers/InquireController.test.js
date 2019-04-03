var request = require('supertest');
var should = require('should');
var sails = require('sails');

describe("InquireController", function() {

  //查询用户对应的钱包地址，钱包秘钥，钱包里的积分余额，冻结数量
  describe("userInformation", function() {
    it("shoud get text.length", function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/inquire/userInformation")
        .send()
        .expect(200)
        .end(function(err, results) {
          should(results.text.length).be.exactly(232);
          done();
        })
    })
  })
  //查询指定用户的排名，捐出步数和捐赠金额
  describe("ranking", function() {
    it("shoud get text.length", function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/inquire/ranking")
        .send({ walletAddress: "jHcEbd59Wi1vSFpMJHrBW3EA53S2yvrErf" })
        .expect(200)
        .end(function(err, results) {
          should(results.text.length).be.exactly(279)
          done()
        })
    })
  })
  //查询捐赠排行
  describe("donateList", function() {
    it("shoud get text.length", function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/inquire/donateList")
        .send({ page: 1 })
        .expect(200)
        .end(function(err, results) {
          should(results.text).be.exactly(4)
          done()
        })
    })
  })

  //查询指定用户的累计运动步数
  describe('allStep', function() {
    it('should get Not find', function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/inquire/allStep")
        .send({ walletAddress: "jHcEbd59Wi1vSFpMJHrBW3EA53S2yvrErs" })
        .expect(404)
        .end(function(err, results) {
          should(results.text).be.exactly("Not find")
          done()
        })
    })
  })
})