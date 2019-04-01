/**
 * Walletpoint.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    walletAddress: {
      type: 'string',
      required: true,
      //默认值
      // defaultsTo: 0
    },
    point: {
      type: 'number',
      // defaultsTo: 0
    },
    tips: {
      type: 'string',
    }
  },

};