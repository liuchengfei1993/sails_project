/**
 * 启瑞云短信发送接口
 * @author qiruiyun
 */
 
const superagent = require('superagent');
const querystring = require('querystring');

module.exports = {
	//接口短信
	baseUrl: sails.config.sms.qiRui.baseUrl,
	apiKey: sails.config.sms.qiRui.apiKey,
	apiSecret: sails.config.sms.qiRui.apiSecret,
	sign: sails.config.sms.qiRui.sign,

	//营销短信
	s_baseUrl: sails.config.sms.sQiRui.baseUrl,
	s_apiKey: sails.config.sms.sQiRui.apiKey,
	s_apiSecret: sails.config.sms.sQiRui.apiSecret,
	s_sign: sails.config.sms.sQiRui.sign,


 	getRequestUrl: function(mobile, message) {
	  //短信内容(【签名】+短信内容)，系统提供的测试签名和内容，如需要发送自己的短信内容请在启瑞云平台申请签名和模板
		var content = this.sign + message;
		let data = {dc:'15', un:this.apiKey, pw:this.apiSecret, da:mobile, sm:content, tf:'3', rf:'2', rd:'1'};
		return this.baseUrl + '?' + querystring.stringify(data);
  	},

  	sendMessage: async function(mobile, message) {
		let smsUrl = this.getRequestUrl(mobile, message);
		return new Promise(function(resolve, reject) {
			superagent.get(smsUrl).then(function(res) {
				//console.log(new Date().toISOString(), __filename+":"+__line, res.text);
				var obj = JSON.parse(res.text);
				if(obj.success) {
					resolve(true);
				} else {
					resolve(false);
				}
			}).catch(function(err){
				console.log(new Date().toISOString(), __filename+":"+__line, err);
				resolve(false);
			});
		});	
	},

	getSailsUrl: function(mobile, message) {
		//短信内容(【签名】+短信内容)，系统提供的测试签名和内容，如需要发送自己的短信内容请在启瑞云平台申请签名和模板
		var content = this.s_sign + message;
		let data = {dc:'15', un:this.s_apiKey, pw:this.s_apiSecret, da:mobile, sm:content, tf:'3', rf:'2', rd:'1'};
		return this.s_baseUrl + '?' + querystring.stringify(data);
	},
	sendSailsMessage: function(mobile, message) {
		let smsUrl = this.getSailsUrl(mobile, message);
		return new Promise( async function (resolve, reject) {
			var ret = await superagent.get(smsUrl).then(function(res) {
				//打印返回结果
				console.log(new Date().toISOString(), __filename+":"+__line, res.text);
				var obj = JSON.parse(res.text);
				if(obj.success) {
					resolve(true);
				} else {
					resolve(false);
				}
			}).catch(function (err) {
				console.log(new Date().toISOString(), __filename+":"+__line, err);
				reject(err);
			});
		});
	},
}
