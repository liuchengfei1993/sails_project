/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var WXBizDataCrypt = require("./WXBizDataCrypt");
var url = require('url');
module.exports = {
  

  /**
   * `UsersController.lcf()`
   */
  //weChat running
  lcf: async function (req, res) {

    const http = require('https');

    var appid = "wx43c1c9647ca0209f";
    var secret = "67b546c0e5af6496ec5b3b2e747ef25a";
    var code = "023Hcp8J1j1g830Sis8J1ZDi8J1Hcp85"
    var step;
    http.get("https://api.weixin.qq.com/sns/jscode2session?appid=" +
      appid +
      "&secret=" +
      secret +
      "&js_code=" +
      code +
      "&grant_type=authorization_code",
      function(req, res) {
        let html = '';
        req.on('data', function(data) {
          html += data;
        });
        req.on('end', function() {
          let result = JSON.parse(html);
          console.log(result);
          let session_key = result.session_key;
          let openid = result.openid;
          let encryptedData = "g2FX6f04YpUqCQak+duvBV3GiLXldV/W66m61ve61sLmrXjaKJf7lGVQyiHu/X7WGS4MUvWhON+SW3nlp+1C40ywQXKvo7nFhDjMS71Wfmx4caBZgDbr4+WFwGfIVAGTLL6T8sLvs63QYd4uXjVXaBBCjHjCnvAxvLZ3ViagLXuld8WXKagrroamJA+PhWiroyW7Y+mmhGEz49ppW1p1ppYJBRQv6DORGsLshTQLOIc5GEV+ENbRSW7/39dXzX3+9v5ZIEG3KkaJYQZVqGP9lTgooK6MF2ynzcs+hIbrD1/z8L1rkq6+P7pdZe/1LRQgC44awxlA155aBotK67cPsKcD5grD4CRaQz59FKXpwuzIz+Osw8OYOIs1/TFQl037NYobBPIwrJzgKLmAYDzwh4c07yQDukG+JfTuBeBystSRwvqEIZwvvFgyg0FBn571NqfQw9ePqF9+OUSPJsYfAW6pMyCeQoCN2ku5slnHGBvTyjqEc7dvH1WAcIScHgBGyca5WQv02a1Smtu4wFQTRZ2eTPwu6olJCqLi3X+c8RquCqLwoGEFr+eTdQp9h25+2v2ovj1h+8YgHpZxPcO6orbbFUisKpKl+AaYqNztZ9buiUn7yj6bdm+UAEIjZUGTczS9jDlH3aKgjWKUXTqSD6RAEd+S9sdHLY6Jw0ada8kcB8k7wwGOv/aoV3EupdxNoykgN3q2w8ErVNz5BxRG5+hGBRN0ze14ePmLu4o7OfMyY4ReDAckZo09vvh1uEmqwkBrHSzgLlWXuFVIrHMk5JJjkK4mqLA6ZVUwwy2Nrf6j2K49mNjxvyAtkwpHlJpMSa5K1NWuWtNW2NYsFhAWXpZx4DPPNsFMvCWgx4nqD2Zx03wma8v33vVVooHkDBOCktwz62jGAmS7G/HUVLFTFN0iy7zgk8sZEUfaFPXQWp5gXm4wf3lbNRfP8GMVs17j/IDBBH0VHGTlAJYH4duivDeJAS57xiCZBHLkOdMtBKa5Oh4zF3cw72dbl3gKFm9S4rW9vPhEB8EPEyjgDobPtAbGOK9eyn/G2a8UeKrUMBEnOMZkjpEZX4lp7odTUY1fJQWxVXi37KmExIVu0IdhdG6wZtgc22RmCUce7JyKieDCAID0vkQXQ+xBmlWzPO1RuEDUHKPnO4PxHuecUcUEqEjm++hgO4NJA3xrm0OG6lq2QoodNYGsPXI8EJwBTgHqfkDsqGMMdoTIYXM2zyFH6JYmABZsYnyVNgP7KQkaE2anaaLwD3ENxi8aztHTtYXpAXW9qu6bRZyK2FUN9Zz6IoZdSj8WOSAiqIvlQZx8IZZFB9FREUETnVZUhxfext/SUJ+pqRFLikzXOxaGDESZp3x0iAOCtcyijGwtsaqHPtQZAnVUDicwpDro/Z0vQ7AWzJ2gXGJ4FOW3NTKCycnWsa2496XaGpb91PZVaYrX3EF9xfXxVQIMQQu+EjgNt3nxtWcaC2VenbKoIKp9WSNOJg9SyS8fqFiNQL0gpgouCgrfiKV9X4Z3x8IkJlDQ/RQXlkVaaUZO1nIl+OVYkA8yVs4iFx4wI77iB3bmoeF8CqwYMrTadSt9Xto9MPtscIDnlF0F7FYTB+g6S38jieiCDsC951U2CtK02HWKFqWAFt4=";
          let iv = "LA0+0bEA8friqB52dreAMQ==";
          var pc = new WXBizDataCrypt(appid, session_key);
          var data = pc.decryptData(encryptedData, iv);
          step = data.stepInfoList;
          console.log(step);
          
        });
      })
    // return res.json({
    //   todo: "暂无数据"
    // });
      return res.json({step});
  },

  /**
   * `UsersController.login()`
   */
  login: async function (req, res) {
    //获取get方法的参数
    // 添加：
    //  var arg1 = url.parse(req.url, true).query;
     //打印键值对中的值
    // console.log(arg1.id);
    console.log(req.allParams())
    let rows = await Admin.create({ usernam: 'lcjtmp6@163.com1', password: '六六六1', email: '6661' }).fetch();
    // await 解决异步问题
    // fetch(); 返回刚才的数据
    console.log(rows);
    return res.send(rows);
    //  自动接收数据并插入表中方式：
    // let reg_info = req.allParams();
    // console.log(reg_info);
    // let row = await Manage.create(reg_info).fetch();
    // return res.json({
    //   todo: 'login() is not implemented yet!'
    // });
  },

  /**
   * `UsersController.logout()`
   */
  logout: async function (req, res) {
   // 添加多条数据：
    let data = [
      { usernam: 'lcjtmp1@163.com1', password: 'aaaa1', email: '6661' },
      { usernam: 'lcjtmp2@163.com1', password: 'bbbb1', email: '6661' },
      { usernam: 'lcjtmp3@163.com1', password: 'cccc1', email: '6661' }
    ];
    let rows = await Admin.createEach(data);
    console.log(rows);
    return res.send(rows);
  },

  //查询
  index: async function(req, res) {
    let rs = await Admin.find({
       id : {'<':10}
     });
     console.log(rs);
     return res.send(rs);
  },

  //更新
  update: async function (req, res) {
    let rows = await Admin.update({ usernam: 'lcjtmp6@163.com' }, { password: '我是改过的', email: '333' });
    console.log(rows); //返回一个数组，哪怕是一条数据,是被更新的数据
    return res.send(rows);
  },

  //删除
  delete: async function (req, res) {
     let rows = await Admin.destroy({ id: 5 });
     console.log(rows); //返回一个数组，哪怕是一条数据,是被删除的那条数据
     return res.send(rows);
  },

  //分页
  paging: async function (req, res) {
     let rs = await Admin.find().skip(2).limit(1);
     console.log(rs);
     return res.send(rs);
  },

  //统计录数
  acount: async function (req, res) {
     let rs = await Admin.count();
     console.log(rs); //返回数字
     return res.send("ok");
  },

  //排序
  sort: async function (req, res) {
    let rs = await Admin.find().sort('id desc');
    console.log(rs);
    return res.send(rs);
  },
};

//拦截器
module.exports.policies = {
    UserController: {
      '*': 'isLoggedIn', //把所有的页面都拦截了
      'delete': 'isAdmin',
      'login': true //允许l访问ogin
    }
  }
