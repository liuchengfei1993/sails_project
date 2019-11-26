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

  // schema: true, //严格匹配数据表的模式
  // migrate: 'alter', //允许sails修改表的结构
  // fetchRecordsOnUpdate: true,
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

    //id: { type: 'string', columnName: '_id' } 注：mongodb使用
  },

  dataEncryptionKeys: {
    default: 'vpB2EhXaTi+wYKUE0ojI5cVQX/VRGP++Fa0bBW/NFSs='
  },
};