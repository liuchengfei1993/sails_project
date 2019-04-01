/**
 * Running.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    todayStepNum: {
      type: 'number',
      // required: true,
      //默认值
      defaultsTo: 0
    },
    donateStep: {
      type: 'number',
      defaultsTo: 0
    },
    donateMoney: {
      type: 'number',
      defaultsTo: 0
    }
  },
};