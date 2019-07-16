/**
 * 短信发送接口
 * @author qiruiyun
 */
 
const qrSms = require('./QiRuiSms');
exports.sendSms = async function(mobile,message) {
	return await qrSms.sendMessage(mobile,message);
};

exports.sendSailsSms = async function(mobile,message) {
	return await qrSms.sendSailsMessage(mobile,message);
}
