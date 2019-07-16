/**
 * VerifyCodeUtil.js
 *
 * @description :: 验证码工具类
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var http = require('http');
var xml = require('node-xml');
var sms = require('./Sms');

var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport(sails.config.email));
module.exports = {
    //发送接口
    sendsms: async function (mobile, content, callback) {
        return await sms.sendSms(mobile, content);
    },

    //发送营销短信
    sendSails: async function (content, mobile, callback) {
        // if (process.env.NODE_ENV !== "production")
        // {
        //   return callback(true, 'sendsms content:' + content + ' mobilephone:' + mobile + ' success');
        // } else {
        return await sms.sendSailsSms(mobile, content);
        // }
    },

    sendmail: async function (ToEmail, Subject, Content) {
        // if (process.env.NODE_ENV !== "production") {
        //     return callback(true, null);
        // }
        return new Promise(function (resolve, reject) {
            var mailoptions = {
                from: sails.config.email.auth.user,
                to: ToEmail,
                subject: Subject,
                text: Content
            };
            transport.sendMail(mailoptions, function (err, response) {
                transport.close();
                if (err) {
                    sails.log.error(new Date().toISOString(), __filename+":"+__line, err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        }); 
    },

    compare: function (s1, s2) {
        return s1 == s2;
        //sails.log("process.env.NODE_ENV:"+process.env.NODE_ENV);
        /*
        return (process.env.NODE_ENV !== "production")
        ? true
        : s1 == s2;
        */
    },

    /*
    比较短信验证码时效性(5分钟)
    */
    verifyCodeIsValid: function (verifyCodeTime) {
        var now = new Date().getTime();
        return ((now - verifyCodeTime) <= CONST.VERIFY_CODE_TIME_MAX);
    },

    /*
    比较邮箱验证码时效性(60分钟)
    */
    verifyEmailCodeIsValid: function (verifyEmailCodeTime) {
        var now = new Date().getTime();
        return ((now - verifyEmailCodeTime) <= CONST.VERIFY_EMAIL_CODE_TIME_MAX);
    }
}

