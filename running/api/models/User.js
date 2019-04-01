/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true,
      //自动加密
      // encrypt: true
    },
    inviter: {
      type: 'string',
      required: true
    },
    walletAddress: {
      type: 'string',
      required: true
    },
    secretKey: {
      type: 'string',
      required: true,
      //自动加密
      // encrypt: true
    }
  },
};