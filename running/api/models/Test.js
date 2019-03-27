/**
 * Test.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
// api/models/Test.js
  attributes: {
    id: { type: 'number', required: true, autoIncrement: true },
    name: { type: 'string', required: true },
    money: { type: 'string', required: true },
  },
};

