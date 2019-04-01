var Sails = require('sails'),
  sails;

before(function(done) {
  Sails.lift({
    log: {
      level: 'error' //指定错误级别，避免出现调试输出，这主要是用来调试controller
    }
  }, function(err, server) {
    sails = server;
    if (err)
      return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
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