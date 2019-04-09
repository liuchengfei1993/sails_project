/**
 * 200 (Feedback) Response
 *
 * Usage:
 * return res.feedback(success, data, msg);
 *
 * @param  {code} code
 * @param  {Object} data
 * @param  {String} msg
 *
 */

module.exports = function feedback (code, dataObj, msg) {
	// Get access to `req`, `res`, & `sails`
	var res = this.res;
	var body;
	body= {'code': code, 'data': dataObj,'msg': msg};
	res.status(200).json(body);
};
