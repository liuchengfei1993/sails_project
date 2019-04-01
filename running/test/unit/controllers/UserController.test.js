var request = require('supertest');
var should = require('should');

//测试用例
describe('UsersController', function() {
  describe('注册接口', function() {
    it('注册成功', function(done) {
      request(sails.hooks.http.app)
        .get('/Vigorous/user/register?openId=unitTest&username=unitTest&password=123456')
        .end(function(err, results) {
          should(results.text).be.exactly("注册成功");
          done();
        });
    });
  });
  describe('注册接口', function() {
    it('注册失败', function(done) {
      request(sails.hooks.http.app)
        .get('/Vigorous/user/register?openId=unitTest&username=unitTest&password=123456')
        .end(function(err, results) {
          should(results.text).be.exactly("该号码已被注册");
          done();
        });
    });
  });
  describe('注册接口', function() {
    it('缺少参数', function(done) {
      request(sails.hooks.http.app)
        .get('/Vigorous/user/register?openId=unitTest&username=unitTest')
        .end(function(err, results) {
          should(results.text).be.exactly("缺少参数");
          done();
        });
    });
  });
  describe('登录接口', function() {
    it('登录成功', function(done) {
      request(sails.hooks.http.app)
        .get('/Vigorous/user/login?openId=unitTest')
        .end(function(err, results) {
          should(results.text).be.exactly("unitTest");
          done();
        });
    });
  });
  describe('登录接口', function() {
    it('请先注册', function(done) {
      request(sails.hooks.http.app)
        .get('/Vigorous/user/login?openId=unitTesst')
        .end(function(err, results) {
          should(results.text).be.exactly("请先注册！");
          done();
        });
    });
  });
});