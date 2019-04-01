/**
 * InquireController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var url = require('url');
//获取今日零点的时间戳
let time = Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime()));

module.exports = {

  //查询用户对应的钱包地址，钱包秘钥，钱包里的积分余额，冻结数量
  userInformation: async function(req, res) {
    //获取用户openId
    var openId = req.session.openId;
    if (openId) {
      //查询用户钱包地址，钱包秘钥
      var findResult = await User.find({
        where: { openId: openId }
      })
      var walletAddress = findResult[0].walletAddress;
      var secretKey = findResult[0].secretKey;
      //查询积分余额
      var pointRes = await Walletpoint.find({
        where: { openId: openId }
      })
      var pointBalance = pointRes[0].point;
      //查询冻结

      //返回结果
      return res.json({
        walletAddress: walletAddress,
        secretKey: secretKey,
        pointBalance: pointBalance
      })
    } else {
      return res.send("❌")
    }
  },

  //查询指定用户的排名，捐出步数和捐赠金额
  //需要参数：walletAddress,时间
  ranking: async function(req, res) {
    var date = url.parse(req.url, true).query;
    //查找指定钱包的捐赠步数
    console.log(date);
    let openId = await User.find({
      where: { walletAddress: date.walletAddress }
    })
    console.log(openId);
    let walletFind = await Running.find({
      where: { openId: openId[0].openId }
    })
    //查找大于指定用户的捐赠步数的总人数
    let findResult = await Running.find({
      updatedAt: { "<": time },
      donateStep: { ">=": walletFind[0].donateStep }
    }).sort('donateStep desc')
    return res.json({
      ranking: findResult.length,
      donateStep: walletFind[0].donateStep,
      donateMoney: walletFind[0].donateMoney
    })
  },

  //查询今日所有用户捐赠排行榜
  donateList: async function(req, res) {
    //需要参数，第几页
    var date = url.parse(req.url, true).query;
    var number = date.number;
    //找到今日更新了步数的用户，加入排行
    let findResult = await Running.find({
      updatedAt: { "<": time }
    }).sort('donateStep desc').limit(10).skip((number - 1) * 10)
    console.log(findResult);
    return res.send(findResult)
  },


  //查询指定用户的累计运动步数
  //需要参数 walletAddress
  allStep: async function(req, res) {
    //通过钱包地址查到openId
    var date = url.parse(req.url, true).query;
    var openId = await User.find({
      where: { walletAddress: date.walletAddress }
    })
    //通过openId查找用户历史数据
    var findResult = History.find({
      where: { openId: openId }
    })
    return res.send(findResult)
  }
};