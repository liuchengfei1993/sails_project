/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var url = require('url');
var Wallet = require('jcc_jingtum_base_lib').Wallet;


module.exports = {

  //注册接口
  register: async function(req, res) {
    // 获取请求参数
    var date = url.parse(req.url, true).query;
    if (date.openId && date.password && date.username) {
      //判断用户是否已经注册
      var findResult = await User.find({
        where: { openId: date.openId },
      })
      //写入数据库
      if (findResult.length === 0) {
        //生成钱包和密钥
        wallet = Wallet.generate();
        console.log(wallet)
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
        console.log(rows)
        //在session中存入openId
        req.session.openId = date.openId;
        console.log(req.session);
        //第一次建立Wallepoint表
        await Walletpoint.create({ openId: date.openId, walletAddress: wallet.address })
        //第一次建立Running表
        await Running.create({ openId: date.openId });
        //第一次建立History表
        // await History.create({ openId: date.openId, timestamp: new Date() });
        return res.send('注册成功')
      } else {
        return res.send("该号码已被注册")
      }
    } else {
      return res.send("缺少参数")
    }
  },

  //登录接口
  login: async function(req, res) {
    var date = url.parse(req.url, true).query;
    console.log(req.session)
    if (req.session.openId || date.openId) {
      req.session.openId = date.openId;
      let findResult = await User.find({
        where: { openId: req.session.openId }
      })
      if (findResult.length !== 0) {
        console.log('登陆成功')
        return res.send(findResult[0].openId);
      }
      return res.send('请先注册！');
    } else {
      return res.send('请先注册！')
    }
  },
};