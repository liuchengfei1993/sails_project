var request = require('supertest');
var should = require('should');
var sails = require('sails');

describe("TodayRunController", function() {

  //捐赠接口
  describe("donateSteps", function() {
    it("shoud get 捐赠成功，捐赠金额为：0.1111元，获得：11.11积分", function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/todayrun/donateSteps")
        .send({ todayStep: 73225, donateStep: 11311 })
        .expect(200)
        .expect("捐赠成功，捐赠金额为：0.11311元，获得：11.311积分", done);
    })
  })


  //激活接口
  describe("activate", function() {
    it("shoud get 请勿重复操作", function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/todayrun/activate")
        .send({ walletAddress: "jHcEbd59Wi1vSFpMJHrBW3EA53S2yvrErf" })
        .expect(400)
        .expect("请勿重复操作", done)
    })
  })
  describe("activate", function() {
    it("shoud get 请勿重复操作", function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/todayrun/activate")
        .send()
        .expect(400)
        .expect("请勿重复操作", done)
    })
  })

  //
})