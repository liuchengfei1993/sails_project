/**
 * InquireController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var url = require('url');
const http = require('https');

//获取今日零点的时间戳
let time = Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime()));

module.exports = {

  //查询用户对应的钱包地址，钱包秘钥，钱包里的积分余额，冻结数量
  userInformation: async function(req, res) {
    //获取用户openId
    var openId = req.session.openId;
    let result = ""
    if (openId) {
      //查询用户钱包地址，钱包秘钥
      var findResult = await User.find({
        openId: openId
      })
      if (findResult !== 0) {
        var walletAddress = findResult[0].walletAddress;
        var secretKey = findResult[0].secretKey;
        //查询积分余额
        var pointRes = await Walletpoint.find({
          openId: openId
        })
        var pointBalance = pointRes[0].point;
        var exHosts = ['ewdjbbl8jgf.jccdex.cn', 'e5e9637c2fa.jccdex.cn', 'e9joixcvsdvi4sf.jccdex.cn', 'eaf28bebdff.jccdex.cn']
        sails.log("exHosts:" + exHosts[Math.floor(Math.random() * 5)])
        //查询冻结
        http.get("https://" + exHosts[Math.floor(Math.random() * 5)] + '/exchange/balances?address=' + walletAddress,
          function(req, res) {
            let html = '';
            req.on('data', function(data) {
              html += data;
              req.on('end', function() {
                result = JSON.parse(html);
                sails.log("result:" + result);
              });
            });
          })
        //返回结果
        return res.send({
          "walletAddress": walletAddress,
          "secretKey": secretKey,
          "pointBalance": pointBalance,
          "result": result
        })
      } else {
        return res.status(400).send("请重新登录");
      }
    } else {
      return res.status(404).send("Not find");
    }
  },

  //查询指定用户的排名，捐出步数和捐赠金额
  //需要参数：walletAddress
  ranking: async function(req, res) {
    var date = req.body;
    //查找指定钱包的捐赠步数
    sails.log(date);
    let openId = await User.find({
      walletAddress: date.walletAddress
    })
    sails.log(openId);
    if (openId.length !== 0) {
      let walletFind = await Running.find({
        openId: openId[0].openId
      })
      sails.log(walletFind)
      //查找大于指定用户的捐赠步数的总人数
      let findResult = await Running.find({
        updatedAt: { ">": time },
        donateStep: { ">": walletFind[0].donateStep }
      })
      sails.log(findResult);
      sails.log("length:" + findResult.length)
      return res.status(200).send({
        ranking: findResult.length + 1,
        donateStep: walletFind[0].donateStep,
        donateMoney: walletFind[0].donateMoney
      }) //实际
    } else {
      return res.status(404).send("Not find");
    }
  },

  //查询今日所有用户捐赠排行榜
  donateList: async function(req, res) {
    //需要参数，第几页
    var date = req.body;
    var page = date.page;
    sails.log("page:" + page)
    //找到今日更新了步数的用户，加入排行
    let findResult = await Running.find({
      updatedAt: { ">": time }
    }).sort('donateStep desc').limit(10).skip((page - 1) * 10)
    sails.log(findResult);
    if (findResult.length !== 0) {
      return res.status.send(findResult) //实际
    } else {
      return res.status(200).send("暂无数据");
    }
  },


  //查询指定用户的累计运动步数
  //需要参数 walletAddress
  allStep: async function(req, res) {
    //通过钱包地址查到openId
    var date = req.body;
    var openId = await User.find({
      walletAddress: date.walletAddress
    })
    sails.log(openId)
    if (openId.length !== 0) {
      //通过openId查找用户历史数据
      var findResult = await History.find({
        openId: openId[0].openId
      })
      if (findResult.length == 0) {
        return res.status(200).send("暂无数据")
      } else {
        return res.status(200).send(findResult)
      }
    } else {
      return res.status(404).send("Not find");
    }
  }
};