/** @fileOverview Javascript cryptography implementation.
 *
 * Crush to remove comments, shorten variable names and
 * generally reduce transmission size.
 *
 * @author xdjiang
 * @author xdjiang
 * @author xdjiang
 */

module.exports = {
  BASE_TOKEN: 'SWT',
  PAY_TOKEN: 'EGP',

  ACTIVE_WALLET: '钱包激活',

  MEMO_MAX_LENGTH: 512,

  ERR_PHONE_EXISTS: '手机号已经存在',
  ERR_EMAIL_EXISTS: '邮箱已经存在',

  // 短信验证码超时最长时间
  VERIFY_CODE_TIME_MAX: 60000 * 5,

  // 邮件验证码超时最长时间
  VERIFY_EMAIL_CODE_TIME_MAX: 60000 * 60,

  // token有效时间
  VERIFY_TOKEN_TIME_MAX: 60000 * 60,

  //验证码错误次数
  VERIFY_ERROR_TIMES: 5,

  MSG_CODE_TAIL: '，若非本人操作，请忽略此信息。',
  MSG_CODE_TITLE: '井畅',

  //验证码提示信息
  TIPS: [
    { type: 0, zh_msg: '验证码：', en_msg: 'Verification code:' },
  ]
};