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
    var date = req.body
    if (date.session_key && date.encryptedData && date.iv) {
      var session_key = date.session_key;
      var openId = openId;
      var encryptedData = date.encryptedData;
      var iv = date.iv;
      //数据解密
      var pc = new WXBizDataCrypt(appid, session_key);
      step = pc.decryptData(encryptedData, iv).stepInfoList;
      //获取今日步数
      var todayStep = step[step.length - 1].step
      var timestamp = step[step.length - 1].timestamp
      // return res.json({ timestamp, todayStep });
      //将数据写入到数据库中
      if (openId !== undefined || "") {
        await Running.update({ openId: openId }, { todayStepNum: todayStep })
      } else {
        return res.status(404).send("Not find");
      }
      var donateData = await Running.find({
        openId: openId
      })
      return res.json({
        todayStep: todayStep,
        donateStep: donateData[0].donateStep || 0,
        donateMoney: donateData[0].donateMoney || 0
      })
    } else {
      return res.status(400).send("The request is invalid");
    }

  },

  //捐赠步数接口
  donateSteps: async function(req, res) {
    //获取本次请求的参数
    var date = req.body
    var openId = req.session.openId;
    if (date.todayStep && date.donateStep && openId) {
      var todayStep = date.todayStep
      var donateStep = date.donateStep;
      //判断用户是否是第一次捐赠
      //查询钱包状态是否是未激活
      let findPoint = await Walletpoint.find({
        openId: openId
      })
      //如果钱包状态为false
      if (findPoint[0].status === false) {
        return res.status(404).send("请先激活钱包");
        //openId合法
      } else if (findPoint[0].status === true || openId !== undefined || "") {
        //更新今日数据
        var row = await Running.update({ openId: openId }, { walletAddress: findPoint[0].walletAddress, todayStepNum: todayStep, donateStep: donateStep, donateMoney: donateStep / 10000 }).fetch()
        //更新钱包积分
        var rows = await Walletpoint.update({ openId: openId }, { walletAddress: findPoint[0].walletAddress, point: donateStep / 100, tips: "捐赠" + donateStep + "步，获得" + donateStep / 100 + "积分" })
        //创建历史数据
        await History.create({ openId: openId, timestamp: new Date(), todayStepNum: todayStep, donateStep: donateStep, donateMoney: donateStep / 10000, point: donateStep / 100, });
      } else {
        return res.status(404).send("Not find");
      }
      //查询是否是受邀用户
      let findInvitation = await User.find({
        openId: openId
      })
      var inviterOpenId = findInvitation[0].inviter
      if (inviterOpenId === "null") {
        return res.send("捐赠成功，捐赠金额为：" + donateStep / 10000 + "元，获得：" + donateStep / 100 + "积分");
      } else {
        //给受邀人发积分
        var oldpoint = await Walletpoint.find({
          openId: findInvitation[0].walletAddress
        })
        if (walletAddress[0].walletAddress !== undefined || "") {
          let rewww = await Walletpoint.update({ walletAddress: findInvitation[0].walletAddress }, { point: oldpoint[0].point + 100, tips: "邀请获得100积分" }).fetch()
          return res.send("捐赠成功，捐赠金额为：" + donateStep / 10000 + "元");
        } else {
          return res.send("捐赠成功，捐赠金额为：" + donateStep / 10000 + "元");
        }
      }
    } else {
      return res.status(400).send("The request is invalid");
    }
  },


  //钱包激活接口
  //参数openId或者钱包地址
  activate: async function(req, res) {
    var date = req.body
    var openId = req.session.openId
    var walletAddress = date.walletAddress;
    if (openId || date.walletAddress) {
      var findWalletAddress = await User.find({
        openId: openId
      })
      if (findWalletAddress[0].walletAddress || date.walletAddress) {
        var status = await Walletpoint.find({
          walletAddress: walletAddress
        })
        if (status[0].status === false) {
          await Walletpoint.update({
            walletAddress: walletAddress
          }, {
            status: true
          })
          sails.log("激活成功")
          return res.status(200).send("激活成功")
        } else {
          return res.status(400).send("请勿重复操作")
        }
      }
    } else {
      return res.status(404).send("会话已过期，请重新登录")
    }
  }
};