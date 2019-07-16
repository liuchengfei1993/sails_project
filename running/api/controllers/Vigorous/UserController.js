/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var url = require('url');
var Wallet = require('jcc_jingtum_base_lib').Wallet;


module.exports = {

    /**
     * @description:注册接口
     * @param { openId, userName, password inviter } req
     * @param {openId} res 
     */
    register: async function (req, res) {
        try {
            // var userName = req.body.userName;
            var openId = req.body.openId;
            // var password = req.body.password;
            var inviter = req.body.inviter;
            // if (Utils.isNil(userName)) {
            //     sails.log.error(new Date().toISOString(),  ResultCode.ERR_HEADER_PARAMETERS.msg);
            //     return res.feedback(ResultCode.ERR_HEADER_PARAMETERS.code, {}, ResultCode.ERR_HEADER_PARAMETERS.msg);
            // }
            if (Utils.isNil(openId)) {
                sails.log.error(new Date().toISOString(),  ResultCode.ERR_HEADER_PARAMETERS.msg);
                return res.feedback(ResultCode.ERR_HEADER_PARAMETERS.code, {}, ResultCode.ERR_HEADER_PARAMETERS.msg);
            }
            // if (Utils.isNil(password)) {
            //     sails.log.error(new Date().toISOString(),  ResultCode.ERR_HEADER_PARAMETERS.msg);
            //     return res.feedback(ResultCode.ERR_HEADER_PARAMETERS.code, {}, ResultCode.ERR_HEADER_PARAMETERS.msg);
            // }
            try {
                var findResult = await User.find({
                    openId: openId
                }).decrypt()
            } catch (err) {
                sails.log.error(new Date().toISOString(),  ResultCode.ERR_SYSTEM_DB.msg, err);
                return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
            }
            if (!Utils.isNil(findResult[0])) {
                sails.log.error(new Date().toISOString(),  ResultCode.ERR_USER_EXISTS.msg);
                return res.feedback(ResultCode.ERR_USER_EXISTS.code, {}, ResultCode.ERR_USER_EXISTS.msg)
            }
            //新建钱包
            wallet = Wallet.generate();
            try {
                var createDate = await User.create({
                    userName: userName,
                    password: password,
                    openId: openId,
                    inviter: inviter || "null",
                    walletAddress: wallet.address ||
                        "null",
                    secretKey: wallet.secret ||
                        "null"
                }).fetch().decrypt();

            } catch (err) {
                sails.log.error(new Date().toISOString(),  err);
                return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
            }
            try {
                await Walletpoint.create({ openId: openId, walletAddress: wallet.address })
            } catch (err) {
                sails.log.error(new Date().toISOString(),  err);
                return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
            }
            try {
                //第一次建立Running表
                await Running.create({ openId: openId, walletAddress: wallet.address }).fetch();
            } catch (err) {
                sails.log.error(new Date().toISOString(),  err);
                return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
            }
            req.session.user = createDate
            createDate = Utils.clearPrivateInfo(createDate);
            return res.feedback(ResultCode.REGISTERED_SUCCESSFULLY.code, createDate, ResultCode.REGISTERED_SUCCESSFULLY.msg);
        } catch (err) {
            sails.log.error(new Date().toISOString(),  err);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }

    },

    /**
     * @description 登录接口
     * @param {openId} req 
     * @param {*} res 
     */
    login: async function(req, res) {
        try {
            var openId = req.body.openId;
            if (Utils.isNil(openId)) {
                sails.log.error(new Date().toISOString(),  );
                return res.feedback(ResultCode.ERR_HEADER_PARAMETERS.code, {}, ResultCode.ERR_HEADER_PARAMETERS.msg);
            }
            try {
                var findResult = await User.find({
                    openId: openId
                }).decrypt()
            } catch (err) {
                sails.log.error(new Date().toISOString(),  );
                return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
            }
            if (Utils.isNil(findResult[0])) {
                sails.log.info(new Date().toISOString(),  );
                return res.feedback(ResultCode.UNDEFINED_USER.code, {}, ResultCode.UNDEFINED_USER.msg);
            }
            req.session.user = findResult
            findResult = Utils.clearPrivateInfo(findResult[0]);
            return res.feedback(ResultCode.REGISTERED_SUCCESSFULLY.code, findResult, ResultCode.REGISTERED_SUCCESSFULLY.msg);
        } catch (err) {
            sails.log.error(new Date().toISOString(),  err);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
    },
};