/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    openId: {
      type: 'string',
      required: true,
      allowNull: false,
      unique: true,
      // encrypt: true,
    },
    username: {
      type: 'string',
      required: true,
      maxLength: 64
    },
    password: {
      type: 'string',
      required: true,
      //自动加密
      encrypt: true,
      maxLength: 64
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
      encrypt: true
    }
  },
};