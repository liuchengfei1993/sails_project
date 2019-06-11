/**
 * RunningController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    /**
     * 获取微信运动数据, 今日捐赠步数， 今日捐赠金额
     * @param { code, session_key, openId, encryptedData(需要解密的数据), iv(解密初始向量) } req
     * @param { todayStep, donateStep, donateMoney } res
     */
    weChatRunning: async function(req, res) {

        try {
            //小程序ID
            var appid = AppId.APP_ID;
            //小程序秘钥
            var secret = AppId.APP_SECRET;
            //小程序openId
            var openId = req.session.user.openId;
            //获取本次请求的code,session_key,openId,encryptedData(需要解密的数据),iv(解密初始向量)(请求带参)
            var data = req.body;
            if (!Utils.isNal(data)) {
                var session_key = data.session_key;
                var openId = openId;
                var encryptedData = data.encryptedData;
                var iv = data.iv;
                //数据解密
                var pc = WXBizDataCrypt.WXBizDataCrypt(appid, session_key);
                step = pc.decryptData(encryptedData, iv).stepInfoList;
                //获取今日步数
                var todayStep = step[step.length - 1].step
                var timestamp = step[step.length - 1].timestamp
                // return res.json({ timestamp, todayStep });
                //将数据写入到数据库中
                if (Utils.isNal(openId)) {
                    await Running.update({ openId: openId }, { todayStepNum: todayStep })
                    var donateData = await Running.find({
                        openId: openId
                    })
                    var responseData = {
                        todayStep: todayStep,
                        donateStep: donateData[0].donateStep,
                        donateMoney: donateData[0].donateMoney
                    }
                    return res.feedback(200, Utils.aesCrypto(responseData), 'ok')
                } else {
                    return res.feedback(ResultCode.ERR_INVALID_CHANNEL.code, {}, ResultCode.ERR_INVALID_CHANNEL.msg)
                }
            } else {
                return res.feedback(ResultCode.ERR_HEADER_PARAMETERS.code, {}, ResultCode.ERR_HEADER_PARAMETERS.msg)
            }
        } catch (err) {
            sails.log.error(new Date().toISOString(), req.method, req.url, err);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
    },

    /**
     * 捐赠步数接口
     * @param { todayStep, donateStep } req
     * @param { responseData } res
     */
    donateSteps: async function(req, res) {
        try {
            //获取本次请求的参数
            var data = req.body;
            var openId = req.session.openId
            console.log(req.session)
            if (!Utils.isNal(openId)) {
                if (!Utils.isNal(data)) {
                    var todayStep = data.todayStep
                    var donateStep = data.donateStep;
                    sails.log.info('openId', openId);
                    //判断用户是否是第一次捐赠
                    //查询钱包激活状态
                    let findPoint = await Walletpoint.find({
                        openId: openId
                    })
                    console.log(findPoint[0].status)
                    //如果钱包状态为false
                    if (findPoint[0].status === false) {
                        return res.feedback(200, {}, '请先激活钱包');
                    } else {
                        //更新今日数据
                        var row = await Running.update({ openId: openId }, { todayStepNum: todayStep, donateStep: donateStep, donateMoney: donateStep / 10000 }).fetch()
                        //更新钱包积分
                        var rows = await Walletpoint.update({ openId: openId }, { walletAddress: findPoint[0].walletAddress, point: donateStep / 100, tips: "捐赠" + donateStep + "步，获得" + donateStep / 100 + "积分" })
                        //创建历史数据
                        await History.create({ openId: openId, timestamp: new Date(), todayStepNum: todayStep, donateStep: donateStep, donateMoney: donateStep / 10000, point: donateStep / 100, });
                    }
                    //查询是否是受邀用户
                    let findInvitation = await User.find({
                        openId: openId
                    })
                    var inviterOpenId = findInvitation[0].inviter
                    var responseData = "捐赠成功，捐赠金额为：" + donateStep / 10000 + "元，获得：" + donateStep / 100 + "积分"
                    console.log(inviterOpenId)
                    if (inviterOpenId === "null") {
                        return res.feedback(200, responseData, 'ok');
                    } else {
                        //给受邀人发积分
                        var oldpoint = await Walletpoint.find({
                            openId: findInvitation[0].walletAddress
                        })
                        if (walletAddress[0].walletAddress !== undefined || "") {
                            let rewww = await Walletpoint.update({ walletAddress: findInvitation[0].walletAddress }, { point: oldpoint[0].point + 100, tips: "邀请获得100积分" }).fetch()
                            return res.feedback(200, responseData, 'ok');
                        } else {
                            return res.feedback(200, responseData, 'ok');
                        }
                    }
                } else {
                    return res.feedback(ResultCode.ERR_HEADER_PARAMETERS.code, {}, ResultCode.ERR_HEADER_PARAMETERS.msg)
                }
            } else {
                return res.feedback(ResultCode.ERR_INVALID_CHANNEL.code, {}, ResultCode.ERR_INVALID_CHANNEL.msg)
            }
        } catch (err) {
            sails.log.error(new Date().toISOString(), req.method, req.url, err);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
    },

    /**
     * 激活接口
     * @param { walletAddress } req
     * @param { ok } res 
     */
    activate: async function(req, res) {
        try {
            //参数，钱包地址
            var walletAddress = req.body.walletAddress;
            if (!Utils.isNal(walletAddress)) {
                var findResult = await Walletpoint.find({
                    walletAddress: walletAddress
                })
                if (!Utils.isNal(findResult)) {
                    if (findResult[0].status === false) {
                        return res.feedback(200, {}, '请勿重复操作')
                    } else {
                        await Walletpoint.update({
                            walletAddress: walletAddress
                        }, { status: true })
                        return req.feedback(200, {}, '激活成功')
                    }
                } else {
                    return req.feedback(200, {}, '请输入正确的钱包地址')
                }
            } else {
                return res.feedback(ResultCode.ERR_INVALID_CHANNEL.code, {}, ResultCode.ERR_INVALID_CHANNEL.msg)
            }
        } catch (err) {
            sails.log.error(new Date().toISOString(), req.method, req.url, err);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
    }
};