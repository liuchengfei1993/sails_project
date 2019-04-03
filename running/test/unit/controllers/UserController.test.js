var request = require('supertest');
var should = require('should');

//测试用例
describe('UserController', function() {

  //注册接口
  describe('#register()', function() {
    it('should get 该号码已被注册', function(done) {
      request(sails.hooks.http.app)
        .post('/Vigorous/user/register')
        .send({ openId: 'test2', password: 'test', username: "test" })
        .expect(200)
        .expect("该号码已被注册", done);
    });
  });
  describe('#register()', function() {
    it('should get The request is invalid', function(done) {
      request(sails.hooks.http.app)
        .post('/Vigorous/user/register')
        .send({ openId: 'test', password: 'test', })
        .expect(400)
        .expect("The request is invalid", done);
    });
  });
  describe('#register()', function() {
    it('should get The request is invalid', function(done) {
      request(sails.hooks.http.app)
        .post('/Vigorous/user/register')
        .send({ openId: 'test', })
        .expect(400)
        .expect("The request is invalid", done);
    });
  });
  describe('#register()', function() {
    it('should get The request is invalid', function(done) {
      request(sails.hooks.http.app)
        .post('/Vigorous/user/register')
        .send({ password: 'test', })
        .expect(400)
        .expect("The request is invalid", done);
    });
  });

  //登录接口
  describe('#login()', function() {
    it('should get 请先注册', function(done) {
      request(sails.hooks.http.app)
        .post('/Vigorous/user/login')
        .send({ openId: 'tesat' })
        .expect(200)
        .expect("请先注册！", done);
    });
  });
  describe('#login()', function() {
    it('should get The request is invalid', function(done) {
      request(sails.hooks.http.app)
        .post('/Vigorous/user/login')
        .send()
        .expect(400)
        .expect("The request is invalid", done);
    });
  });
});