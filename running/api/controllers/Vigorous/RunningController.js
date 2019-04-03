/**
 * RunningController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var url = require('url');
var WXBizDataCrypt = require("../../../assets/js/WXBizDataCrypt");
var handleStep = require("../../../assets/js/utils").handleStep
// const http = require('https');



module.exports = {

  //获取微信运动数据,今日捐赠步数，今日捐赠金额
  weChatRunning: async function(req, res) {
    //小程序ID
    var appid = "wx43c1c9647ca0209f";
    //小程序秘钥
    var secret = "67b546c0e5af6496ec5b3b2e747ef25a";
    //小程序openId
    var openId = req.session.openId;
    //获取本次请求的code,session_key,openId,encryptedData(需要解密的数据),iv(解密初始向量)(请求带参)
    var date = req.body;
    console.log(date);
    if (date.session_key && date.encryptedData && date.iv) {
      var session_key = date.session_key;
      var openId = openId;
      var encryptedData = date.encryptedData;
      var iv = date.iv;
      //数据解密
      var pc = new WXBizDataCrypt(appid, session_key);
      step = pc.decryptData(encryptedData, iv).stepInfoList;
      //获取今日步数
      console.log(step)
      var todayStep = step[step.length - 1].step
      var timestamp = step[step.length - 1].timestamp
      // return res.json({ timestamp, todayStep });
      //将数据写入到数据库中
      if (openId !== "" || undefined) {
        await Running.update({ openId: openId }, { todayStepNum: todayStep })
        var donateData = await Running.find({
          openId: openId
        })
        return res.json({
          todayStep: todayStep,
          donateStep: donateData[0].donateStep,
          donateMoney: donateData[0].donateMoney
        })
      } else {
        return res.status(400).send("openId不合法")
      }
    } else {
      return res.status(404).send("缺少参数")
    }

  },

  //捐赠步数接口
  donateStep: async function(req, res) {
    //获取本次请求的参数
    var date = req.body;
    var openId = req.session.openId
    if (openId !== undefined || "") {
      if (date.todayStep && date.donateStep) {
        var todayStep = date.todayStep
        var donateStep = date.donateStep;
        sails.log.info('openId', openId);
        //判断用户是否是第一次捐赠
        //查询钱包里面是否有积分
        let findPoint = await Walletpoint.find({
          where: { openId: openId }
        })
        console.log(findPoint[0].status)
        if (findPoint[0].status === false) {
          // var rows = await Running.create({ openId: openId, todayStepNum: todayStep, donateStep: 0, donateMoney: 0 }).fetch();
          return res.send("请先激活钱包");
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
          where: { openId: openId }
        })
        var inviterOpenId = findInvitation[0].inviter
        console.log(inviterOpenId)
        if (inviterOpenId === "null") {
          return res.send("捐赠成功，捐赠金额为：" + donateStep / 10000 + "元，获得：" + donateStep / 100 + "积分");
        } else {
          //给受邀人发积分
          var oldpoint = await Walletpoint.find({
            where: { openId: findInvitation[0].walletAddress }
          })
          let rewww = await Walletpoint.update({ walletAddress: findInvitation[0].walletAddress }, { point: oldpoint[0].point + 100, tips: "邀请获得100积分" }).fetch()
          return res.send("捐赠成功，捐赠金额为：" + donateStep / 10000 + "元");
        }
      } else {
        return res.status(404).send("缺少参数")
      }
    } else {
      return res.status(400).send("会话过期，请重新登录")
    }
  }
};