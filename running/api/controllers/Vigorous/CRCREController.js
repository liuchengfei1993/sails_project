/**
 * CRCREController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var url = require('url');


module.exports = {

    /**
     * 公益项目查询接口
     * @param { projectName } req
     * @param {*} res 
     */
    //需要参数：公益项目名称
    CRCREimformation: async function(req, res) {
        try {
            var date = url.parse(req.url, true).query;
            let findResult = await CRCRE.find({
                projectName: date.projectName
            })
            if (!Utils.isNil(findResult)) {
                return res.feedback(200, findResult, '');
            } else {
                return res.feedback(200, {}, '暂无数据');
            }
        } catch (err) {
            sails.log.error(new Date().toISOString(), req.method, req.url, err);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
    },

    /**
     * 公益组织查询接口
     * @param { organizationName } req
     * @param {*} res 
     */
    organizationImformation: async function(req, res) {
        try {
            var date = url.parse(req.url, true).query;
            let findResult = await CommunityOrganizations.find({
                organizationName: date.organizationName
            })
            if (!Utils.isNil(findResult)) {
                return res.feedback(200, findResult, '');
            } else {
                return res.feedback(200, {}, '暂无数据');
            }
        } catch (err) {
            sails.log.error(new Date().toISOString(), req.method, req.url, err);
            return res.feedback(ResultCode.ERR_SYSTEM_DB.code, {}, ResultCode.ERR_SYSTEM_DB.msg);
        }
    }
};