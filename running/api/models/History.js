/**
 * History.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    timestamp: {
      type: 'number',
      required: true
    },
    donateStep: {
      type: 'number',
      defaultsTo: 0
    },
    donateMoney: {
      type: 'number',
      defaultsTo: 0
    },
    point: {
      type: 'number',
      defaultsTo: 0
    },
  },

};