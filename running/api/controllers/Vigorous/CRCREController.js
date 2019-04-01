/**
 * CRCREController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  //公益项目查询接口
  CRCREimformation: async function(req, res) {
    let findResult = await CRCRE.find({
      where: { id: 1 }
    })
    return res.json(findResult);
  },

  //公益组织查询接口
  organizationImformation: async function(req, res) {
    let findResult = await CommunityOrganizations.find({
      where: { id: 1 }
    })
    // return res.json(findResult)
    return res.send("ok")
  }
};