/**
 * CRCRE.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {


    projectName: {
      type: 'string',
      required: true
    },
    position: {
      type: 'string',
    },
    fundScope: {
      type: 'string'
    },
    fundSituation: {
      type: 'string'
    },
    picture: {
      type: 'string'
    },
    frequency: {
      type: 'string'
    },
    video: {
      type: 'string'
    }
  },
};