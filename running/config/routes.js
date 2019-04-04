/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': { view: 'index' },
  '/': 'UsersController.index',
  'GET /users': { action: 'users/logout' },
  // 'GET /users': 'users/logout' 与之相同
  'GET /users/login': { action: 'users/login' },
  'GET /users/update': { action: 'users/update' },
  'GET /users/delete': { action: 'users/delete' },
  'GET /users/acount': { action: 'users/acount' },
  // 'GET /users/sort': 'user.sort',

  //注册登录接口
  'POST /Vigorous/user/register': { action: 'Vigorous/user/register' },
  'POST /Vigorous/user/login': { action: 'Vigorous/user/login' },

  //获取微信运动数据接口，捐赠步数，捐赠金额接口
  'POST /Vigorous/running/weChatRunning': { action: 'Vigorous/running/weChatRunning' },
  'POST /Vigorous/running/donateSteps': { action: 'Vigorous/running/donateSteps' },
  'POST /Vigorous/running/activate': { action: 'Vigorous/running/activate' },

  //获取公益组织,公益项目接口
  'GET /Vigorous/CRCRE/CRCREimformation': { action: 'Vigorous/CRCRE/CRCREimformation' },
  'GET /Vigorous/CRCRE/organizationImformation': { action: 'Vigorous/CRCRE/organizationImformation' },

  //查询用户对应的钱包地址，钱包秘钥，钱包里的积分余额，冻结数量
  'GET /Vigorous/inquire/userInformation': { action: 'Vigorous/Inquire/userInformation' },

  //查询指定用户的排名，捐出步数和捐赠金额
  'POST /Vigorous/inquire/ranking': { action: 'Vigorous/inquire/ranking' },

  //查询指定用户的累计运动步数
  'POST /Vigorous/inquire/allStep': { action: 'Vigorous/inquire/allStep' },

  //查询今日所有用户捐赠排行榜
  'GET /Vigorous/inquire/donateList': { action: 'Vigorous/inquire/donateList' }
};