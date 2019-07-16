/**
 * Utils
 *
 * @description :: 共通
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var btoa = require('btoa');
var atob = require('atob');
var uuid = require('uuid');
var sjcl = require('sjcl');
var jwt = require('jwt-simple');
var redis = require("redis");


module.exports = {
    /**
     * @description :: 加密数据内容
     * @param password 密码
     * @param salt 加密盐
     * @param data 待加密的数据
     * @return 返回加密字符串
     */
    secretEnc: function(password, salt, data) {
        var key = salt + password;
        var secret = sjcl.encrypt(key, data);
        return btoa(secret, {});
    },

    /**
     * @description :: 解密数据内容
     * @param password 密码
     * @param salt 加密盐
     * @param ciphertext 加密的数据
     * @return 返回解密字符串
     */
    secretDec: function(password, salt, ciphertext) {
        var key = salt + password;
        var data = sjcl.decrypt(key, atob(ciphertext));
        return data;
    },

    /**
     * @description :: 计算HASH
     * @param password 密码
     * @param salt 加密盐
     * @param data 需要HASH的数据
     * @return 返回HASH
     */
    secretHash: function(password, salt, data) {
        return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(salt + password + data));
    },

    /**
     * @description :: 计算HASH
     * @param password 密码
     * @param salt 加密盐
     * @param data 需要HASH的数据
     * @return 返回HASH
     */
    getSalt: function() {
        var list = sjcl.random.randomWords(8).join('');
        return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(list));
    },

    /**
     * @description :: 产生指定位数的随机数
     * @param n 随机数的位数
     * @return 返回新生成的随机数
     */
    rndNum: function(n) {
        var rnd = "";
        var arr_number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (var i = 0; i < n; i++) {
            var id = Math.floor(Math.random() * 10);
            if (i === 0 && id === 0) id = 1;
            rnd += arr_number[id];
        }
        return Number(rnd);
    },

    rndNumNoZero: function(n) {
        var rnd = "";
        var arr_number = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (var i = 0; i < n; i++) {
            var id = Math.floor(Math.random() * 10);
            if (i === 0 || id === 0) id = 1;
            rnd += arr_number[id];
        }
        return Number(rnd);
    },

    /**
     * @description :: 赠送swt
     * @param dest 接收方的钱包地址
     * @return 无
     */
    sendGift: function(dest, callback) {
        var address = sails.config.api.gift_account;
        var secret = sails.config.api.gift_secret;
        var payment = {
            source_account: address,
            destination_account: dest,
            destination_amount: {
                value: sails.config.api.gift_amount,
                currency: 'SWT',
                issuer: ''
            }
        };
        var client_id = uuid.v1();
        var wallet = {
            secret: secret,
            address: address
        };
        try {
            ApiRequest.submitPayment(wallet, payment, client_id, false, callback);
        } catch (e) {
            callback(e)
        }

    },

    /**
     * @description :: 获取当前年份
     * @param 无
     * @return 返回当前年份
     */
    getNowYear: function() {
        var time = new Date();
        return time.getFullYear();
    },

    // 得到最新成交列表时间
    formatTime: function(time, status) {
        var t = time
        var commonTime = new Date(t)
        var y = commonTime.getFullYear() >= 10 ?
            commonTime.getFullYear() :
            '0' + commonTime.getFullYear()
        var month = (commonTime.getMonth() + 1) >= 10 ?
            commonTime.getMonth() + 1 :
            '0' + commonTime.getMonth() + 1
        var d = commonTime.getDate() >= 10 ?
            commonTime.getDate() :
            '0' + commonTime.getDate()
        var h = commonTime.getHours() >= 10 ?
            commonTime.getHours() :
            '0' + commonTime.getHours()
        var m = commonTime.getMinutes() >= 10 ?
            commonTime.getMinutes() :
            '0' + commonTime.getMinutes()
        var s = commonTime.getSeconds() >= 10 ?
            commonTime.getSeconds() :
            '0' + commonTime.getSeconds()
        if (status === 0) {
            return y + '-' + month + '-' + d
        } else if (status === 1) {
            return h + ':' + m + ':' + s
        } else if (status === 2) {
            return y + '-' + month + '-' + d + '/' + h + ':' + m
        } else if (status === 3) {
            return y + '-' + month + '-' + d + '/' + h + ':' + m + ':' + s
        }
    },

    /**
     * @description :: 创建token
     * @param id session id
     * @param salt 加密盐
     * @return token
     */
    encodeToken: function(id, salt) {
        var expires = new Date().getTime() + CONST.VERIFY_TOKEN_TIME_MAX;
        return jwt.encode({
            id: id,
            exp: expires
        }, salt);
    },

    /**
     * @description :: 解密token
     * @param token token
     * @param salt 加密盐
     * @return token
     */
    decodeToken: function(token, salt) {
        return jwt.decode(token, salt);
    },

    /**
     * @description :: 删除隐私信息
     * @param userInfo 用户信息
     * @return userInfo
     */
    clearPrivateInfo: function(userInfo) {
        if (!userInfo) return null;
        var newUserInfo = JSON.parse(JSON.stringify(userInfo));
        delete newUserInfo.id;
        delete newUserInfo.salt;
        delete newUserInfo.password;
        delete newUserInfo.createdAt;
        delete newUserInfo.updatedAt;
        delete newUserInfo.avatar;
        delete newUserInfo.status;
        delete newUserInfo.areaCode;
        delete newUserInfo.channel;
        delete newUserInfo.PCSid;
        delete newUserInfo.mobileSid;
        delete newUserInfo.tradePass;
        return newUserInfo;
    },

    /**
     * @description :: 删除隐私信息
     * @param userInfo 用户信息
     * @return userInfo
     */
    clearAdminInfo: function(userInfo) {
        if (!userInfo) return null;
        var newUserInfo = JSON.parse(JSON.stringify(userInfo));
        for (var i = 0; i < newUserInfo.length; i++){
            newUserInfo[i].sendOwner = newUserInfo[i].sendOwner.nickName;
            newUserInfo[i].receiveOwner = newUserInfo[i].receiveOwner.nickName;
            delete newUserInfo[i].id;
            delete newUserInfo[i].updatedAt;

        }
        return newUserInfo;
    },

    /**
     * @description :: 判断是否为空对象
     * @param obj 数据对象
     * @return userInfo
     */
    isNil: function(obj) {
        if (typeof(obj) === "undefined" || obj == null || obj == {}) {
            return true
        }
        var tmp = String(obj);
        if (tmp.length === 0) {
            return true;
        }

        return false
    },

    isNumber: function(num) {
        return !Number.isNaN(parseFloat(num)) && Number.isFinite(parseFloat(num));
    },

    dateFormat: function(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "H+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },

    redisSet: async function(key, data) {
        return new Promise(function(resolve, reject) {
            sails.redis.set(key, data, function(err) {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    },

    redisGet: async function(key) {
        return new Promise(function(resolve, reject) {
            sails.redis.get(key, function(err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },

    redisDel: async function(key) {
        return new Promise(function(resolve, reject) {
            sails.redis.del(key, function(err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },

    arrayUnique: function(arr, name) {
        var hash = {};
        return arr.reduce(function(item, next) {
            hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
            return item;
        }, []);
    },

    isValidChannel: function(channel) {
        var channels = sails.config.api_channels;
        if (!channels || channels.length === 0) return true;

        if (!channel) return true;

        for (var i = 0; i < channels.length; i++) {
            if (channels[i].channel === channel) {
                return true;
            }
            continue;
        }
        return false;
    },
    getIssuer: function(currency) {
        if (currency === CONST.BASE_TOKEN) {
            return ''
        }
        // TODO:目前只是这一个银关配置，所有代币都从这个银关出
        return sails.config.wallet.fgate_account
    },
}