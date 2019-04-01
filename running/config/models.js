/**
 * Default model settings
 * (sails.config.models)
 *
 * Your default, project-wide model settings. Can also be overridden on a
 * per-model basis by setting a top-level properties in the model definition.
 *
 * For details about all available model settings, see:
 * https://sailsjs.com/config/models
 *
 * For more general background on Sails model settings, and how to configure
 * them on a project-wide or per-model basis, see:
 * https://sailsjs.com/docs/concepts/models-and-orm/model-settings
 */

module.exports.models = {

  schema: true, //严格匹配数据表的模式
  migrate: 'alter', //允许sails修改表的结构
  attributes: {
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
    openId: {
      type: 'string',
      required: true,
      // unique: true
    }
    //id: { type: 'string', columnName: '_id' } 注：mongodb使用
  }


  // module.exports.models = {
  //   insertOrUpdate: function(key, record, CB) {
  //     var self = this; // reference for use by callbacks
  //     var where = {};
  //     where[key] = record[key]; // keys differ by model
  //     this.find(where).exec(function findCB(err, found) {
  //       if (err) {
  //         CB(err, false);
  //       }
  //       // did we find an existing record?
  //       if (found && found.length) {
  //         self.update(record[key], record).exec(function(err, updated) {
  //           if (err) { //returns if an error has occured, ie id doesn't exist.
  //             CB(err, false);
  //           } else {
  //             CB(false, found[0]);
  //           }
  //         });
  //       } else {
  //         self.create(record).exec(function(err, created) {
  //           if (err) { //returns if an error has occured, ie invoice_id doesn't exist.
  //             CB(err, false);
  //           } else {
  //             CB(false, created);
  //           }
  //         });
  //       }
  //     });
  //   }
};