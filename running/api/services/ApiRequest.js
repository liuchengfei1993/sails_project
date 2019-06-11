const _ = require('lodash');
const jutil = require('jingtum-lib').utils;
var BigNumber = require('bignumber.js');
var fixed = 8;

function process_balance(data) {
    // var swt_value = new Number(data.native.account_data.Balance) / 1000000.0;
    var swt_value = new BigNumber(data.native.account_data.Balance).dividedBy(1000000.0).toFixed(fixed);
    var freeze0 = sails.config.freezed.reserved + (data.lines.lines.length + data.orders.offers.length) * sails.config.freezed.each_freezed;
    var _data = [{
        value: swt_value,
        currency: CONST.CURRENCY_BASE,
        issuer: '',
        freezed: freeze0 + ''
    }];
    for (var i = 0; i < data.lines.lines.length; ++i) {
        var item = data.lines.lines[i];
        var tmpBal = {
            value: item.balance,
            currency: item.currency,
            issuer: item.account,
            freezed: '0'
        };
        //var freezed = 0;
        var freezed = new BigNumber(0);
        data.orders.offers.forEach(function(off) {
            var taker_gets = jutil.parseAmount(off.taker_gets);
            if (taker_gets.currency === _data[i].currency && taker_gets.issuer === _data[i].issuer && taker_gets.currency === 'SWT') {
                //var tmpFreezed = parseFloat(_data[i].freezed) + parseFloat(taker_gets.value);
                var tmpFreezed = new BigNumber(_data[i].freezed).plus(taker_gets.value);
                //_data[i].freezed = tmpFreezed + '';
                _data[i].freezed = tmpFreezed.toFixed(fixed);
            } else if (taker_gets.currency === tmpBal.currency && taker_gets.issuer === tmpBal.issuer) {
                //freezed += parseFloat(taker_gets.value);
                freezed = freezed.plus(taker_gets.value);
            }
        });
        // tmpBal.freezed = parseFloat(tmpBal.freezed) + freezed;
        // tmpBal.freezed = tmpBal.freezed.toFixed(6) + '';

        tmpBal.freezed = freezed.plus(tmpBal.freezed);
        tmpBal.freezed = tmpBal.freezed.toFixed(fixed);

        _data.push(tmpBal);
    }
    return _data;
}

exports.getBalance = async function(address, options, callback) {
    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        sails.log.error('remote is disconnected');
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback(null, []);
        }
    }
    var options = {
        account: address,
        type: 'trust'
    };
    async.parallel({
        native: function(callback) {
            var req1 = remote.requestAccountInfo(options);
            req1.submit(callback);
        },
        lines: function(callback) {
            var req2 = remote.requestAccountRelations(options);
            req2.submit(callback);
        },
        orders: function(callback) {
            var req3 = remote.requestAccountOffers(options);
            req3.submit(callback);
        }

    }, function(err, results) {
        if (err) {
            sails.log.error('fail to get balance: ' + err);
            return callback(err, []);
        }
        return callback(null, process_balance(results));
    });
};

exports.submitPayment = async function(wallet, payment, callback) {

    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback('server is disconne');
        }
    }
    var to = payment.destination_account;
    var amount = payment.destination_amount;
    var tx = remote.buildPaymentTx({ account: wallet.address, to: to, amount: amount });
    if (payment.memos) {
        // add memo
        tx.addMemo(payment.memos);
    }
    tx.setSecret(wallet.secret);
    tx.setFee(10);
    tx.submit(function(err, result) {
        if (err) {
            return callback('fail to payment: ' + err);
        }
        result.success = result.engine_result === 'tesSUCCESS';
        callback(null, result);
    });
};

exports.createOrder = async function(wallet, order, callback) {
    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback('server is disconnected');
        }
    }
    var pays = {
        value: order.taker_pays.value,
        currency: order.taker_pays.currency,
        issuer: order.taker_pays.counterparty ?
            order.taker_pays.counterparty : ''
    };
    var gets = {
        value: order.taker_gets.value,
        currency: order.taker_gets.currency,
        issuer: order.taker_gets.counterparty ?
            order.taker_gets.counterparty : ''
    };
    var tx = remote.buildOfferCreateTx({
        type: _.capitalize(order.type),
        source: wallet.address,
        taker_pays: pays,
        taker_gets: gets
    });
    tx.setSecret(wallet.secret);
    tx.setFee(10);
    tx.submit(function(err, result) {
        if (err) {
            return callback('fail to create order: ' + err);
        }
        callback(null, result);
    });
};

exports.cancelOrder = async function(wallet, sequence, callback) {
    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback('server is disconnected');
        }
    }
    var tx = remote.buildOfferCancelTx({ source: wallet.address, sequence: sequence });
    tx.setSecret(wallet.secret);
    tx.submit(function(err, result) {
        if (err) {
            return callback('fail to cancel offer: ' + sequence);
        }
        callback(null, result);
    });
};

exports.getSequence = async function(address, callback) {
    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        sails.log.error('remote is disconnected');
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback('remote is disconnected');
        }
    }
    var account = {
        account: address,
        type: 'trust'
    };
    remote.requestAccountInfo(account).submit(function(err, result) {
        if (err) {
            return callback('fail to get sequence, address: ' + address);
        }
        callback(null, result);
    });
};

exports.signSubmit = async function(sign, callback) {
    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        sails.log.error('remote is disconnected');
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback('remote is disconnected');
        }
    }
    var options = {};
    options.blob = sign;
    remote.buildSignTx(options).submit(function(err, result) {
        if (err) {
            return callback('fail to signed submit, error: ' + err);
        }
        callback(null, result);
    });
};

function process_order_list(orders) {
    var _results = [];
    for (var i = 0; i < orders.length; ++i) {
        var order = orders[i];
        var _order = {};
        _order.type = order.flags === 0x00020000 ?
            'sell' :
            'buy';
        var base = (_order.type === 'sell' ?
            order.taker_gets :
            order.taker_pays);
        base = jutil.parseAmount(base);
        var counter = (_order.type === 'sell' ?
            order.taker_pays :
            order.taker_gets);
        counter = jutil.parseAmount(counter);
        _order.pair = base.currency + (base.issuer ?
            '+' + base.issuer :
            '') + '/' + counter.currency + (counter.issuer ?
            '+' + counter.issuer :
            '');
        //_order.price = (parseFloat(counter.value) / parseFloat(base.value)).toFixed(6);
        _order.price = new BigNumber(counter.value).dividedBy(base.value).toFixed(fixed);
        // _order.amount = parseFloat(base.value).toFixed(6);
        _order.amount = new BigNumber(base.value).toFixed(fixed);
        _order.sequence = order.seq;
        _results.push(_order);
    }
    return _results;
}

exports.getOrderList = async function(address, options, callback) {
    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback('server is disconnected');
        }
    }
    var options = {
        account: address,
        ledger: 'closed'
    };
    var _request = remote.requestAccountOffers(options);
    _request.submit(function(err, result) {
        if (err) {
            sails.log.error('fail to get order list');
            return callback(null, []);
        }
        return callback(null, process_order_list(result.offers));
    });
};

exports.getTransactionList = async function(address, options, callback) {
    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback('server is disconnected');
        }
    }
    var _options = {
        account: address,
        limit: options.results_per_page
    };
    if (options.marker) {
        _options.marker = options.marker;
    }
    var _request = remote.requestAccountTx(_options);
    _request.submit(function(err, result) {
        if (err) {
            sails.log.error('fail to get tx for address: ' + address);
            return callback(null, []);
        }
        callback(null, result);
    });
};

exports.getTransactionDetail = async function(hash, callback) {
    var remote = sails.remote;
    if (!remote || !remote.isConnected()) {
        await JTServer.connect();

        remote = sails.remote;
        if (!remote || !remote.isConnected()) {
            return callback('server is disconnected');
        }
    }
    var _request = remote.requestTx({ "hash": hash });
    _request.submit(function(err, result) {
        if (err) {
            sails.log.error('fail to get tx for hash: ' + hash + ',error:' + err);
            return callback(null, []);
        }
        callback(null, result);
    });
};