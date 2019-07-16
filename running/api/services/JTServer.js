var jingtum = require('jingtum-lib');

module.exports = {
    connect: function() {
        new Promise(async function(resolve, reject) {
            var jtServer = sails.config.wallet.chain_nodes[Math.floor(Math.random() * sails.config.wallet.chain_nodes.length)];
            var remote = new jingtum.Remote(jtServer);
            remote.connect(function(err, data) {
                if (err) {
                    sails.log.error(new Date().toISOString(), __filename + ":" + __line, remote._url, err);
                    resolve(false);
                } else {
                    //sails.log.info((new Date()).toISOString() + ' success connect jingtum server:' + remote._url);
                    sails.log.info(new Date().toISOString(), __filename + ":" + __line, ' success connect jingtum server:' + remote._url);
                    sails.remote = remote;
                    remote.on('disconnect', function() {
                        sails.log.error(new Date().toISOString(), __filename + ":" + __line, ' disconnect to jingtum server:' + remote._url);
                    });

                    remote.on('reconnect', function() {
                        sails.log.error(new Date().toISOString(), __filename + ":" + __line, ' reconnect to jingtum server:' + remote._url);
                    });

                    resolve(true);
                }
            });
        });
    }
};