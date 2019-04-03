var Sails = require('sails'),
  sails;
var request = require('supertest');
var port = 1338; //测试启动端口
agent = request.agent('http://localhost:' + port); //服务器连接，全局变量

before(function(done) {
  Sails.lift({
    log: {
      // level: 'error' //指定错误级别，避免出现调试输出，这主要是用来调试controller
    }
  }, function(err, server) {
    sails = server;
    if (err) {
      return done(err);
    } else {
      agent.post('/Vigorous/user/login')
        .send({ openId: 'tssat' })
        .end(function(err, res) {
          if (err)
            return done(err);
          done(err, sails);
        });
    }
    // here you can load fixtures, etc.
  });
});

after(function(done) {
  var done_called = false;
  Sails.lower(function() {
    if (!done_called) {
      done_called = true;
      setTimeout(function() {
        sails.log.debug("inside app.lower, callback not called yet. calling.");
        done();
      }, 1000);
    } else {
      sails.log.debug("inside app.lower, callback already called.");
    }
  });
});