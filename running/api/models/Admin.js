/**
 * Admin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
   attributes: {
       zh: { type: 'string', required: true },
       nc: { type: 'string', required: true },
       pwd: { type: 'string', required: true }
     }
};

