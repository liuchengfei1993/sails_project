var request = require('supertest');
var should = require('should');
var sails = require('sails');

describe("RunningController", function() {

  //捐赠接口
  describe("donateSteps", function() {
    it("shoud get 捐赠成功，捐赠金额为：1.1311元，获得：113.11积分", function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/todayrun/donateSteps")
        .send({ todayStep: 73225, donateStep: 11311 })
        .expect(200)
        .expect("捐赠成功，捐赠金额为：1.1311元，获得：113.11积分", done);
    })
  })


  //激活接口
  describe("activate", function() {
    it("shoud get 请勿重复操作", function(done) {
      request(sails.hooks.http.app)
      agent.post("/Vigorous/todayrun/activate")
        .send({ walletAddress: "jUPg46e9U8dwiCWTCXfHNXnoNgHkv1aqz8" })
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