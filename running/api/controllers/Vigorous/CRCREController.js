/**
 * CRCREController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var url = require('url');


module.exports = {

  //公益项目查询接口
  //需要参数：公益项目名称
  CRCREimformation: async function(req, res) {
    var date = url.parse(req.url, true).query;
    let findResult = await CRCRE.find({
      projectName: date.projectName
    })
    if (findResult.length !== 0) {
      return res.json(findResult);
    } else {
      return res.status(404).send("Not find");
    }
  },

  //公益组织查询接口
  organizationImformation: async function(req, res) {
    var date = url.parse(req.url, true).query;
    let findResult = await CommunityOrganizations.find({
      organizationName: date.organizationName
    })
    if (findResult.length !== 0) {
      return res.json(findResult);
    } else {
      return res.status(404).send("Not find");
    }
  }
};