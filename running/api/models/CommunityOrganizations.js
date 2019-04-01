/**
 * CommunityOrganizations.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    // fetchRecordsOnUpdate: true,
    createdAt: {
      type: 'number',
      autoCreatedAt: true,
    },
    updatedAt: {
      type: 'number',
      autoUpdatedAt: true,
    },
    id: {
      type: 'number',
      autoIncrement: true,
    },
    organizationName: {
      type: 'string'
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
    },
    donateStep: {
      type: 'number'
    },
    donateMoney: {
      type: 'number'
    }
  },

};