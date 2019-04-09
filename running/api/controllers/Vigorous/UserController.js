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
     * @param {openId,username,password} req 
     * @param {openId} res 
     */
    register: async function(req, res) {
        try {
            // 获取请求参数
            var date = req.body
            if (!Utils.isNil(req.body)) {
                //判断用户是否已经注册
                var findResult = await User.find({
                    openId: date.openId
                })
                //写入数据库
                if (Utils.isNil(findResult)) {
                    //生成钱包和密钥
                    wallet = Wallet.generate();
                    //第一次建立User表
                    let rows = await User.create({
                        username: date.username,
                        password: date.password,
                        openId: date.openId,
                        inviter: date.inviter || "null",
                        walletAddress: wallet.address ||
                            "null",
                        secretKey: wallet.secret ||
                            "null"
                    }).fetch();
                    //在session中存入openId
                    req.session.openId = date.openId;
                    //第一次建立Wallepoint表
                    await Walletpoint.create({ openId: date.openId, walletAddress: wallet.address })
                    //第一次建立Running表
                    var running = await Running.create({ openId: date.openId, walletAddress: wallet.address }).fetch();
                    sails.log(running);
                    return res.feedback(200, Utils.aesCrypto(date.openId), "注册成功")
                } else {
                    return res.feedback(200, {}, "该号码已被注册")
                }
            } else {
                return res.feedback(ResultCode.ERR_HEADER_PARAMETERS.code, {}, ResultCode.ERR_HEADER_PARAMETERS.msg);
            }
        } catch (err) {
            sails.log.error(new Date().toISOString(), req.method, req.url, err);
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
            var date = req.body
            console.log(date);
            if (date.openId) {
                req.session.openId = date.openId;
                let findResult = await User.find({
                    openId: date.openId
                })
                if (findResult.length !== 0) {
                    return res.send(findResult[0].openId);
                }
                return res.feedback(200, {}, '请先注册！');
            } else {
                return res.feedback(ResultCode.ERR_HEADER_PARAMETERS.code, {}, ResultCode.ERR_HEADER_PARAMETERS.msg);
            }
        } catch (err) {
            sails.log.error(new Date().toISOString(), req.method, req.url, err);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
    },
};