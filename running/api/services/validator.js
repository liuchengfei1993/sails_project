  var fs = require('fs');
  var path = require('path');
  var ajv = require('ajv');

  var baseDir = path.join(__dirname, '/../../schemas');

  module.exports = (function() {
  var validator = new ajv();

  validator.isValid = function() {
    return validator.validate.apply(validator, arguments);
  };
  // Load Schemas
  fs.readdirSync(baseDir).filter(function(fileName) {
    return /^[\w\s]+\.json$/.test(fileName);
  }).map(function(fileName) {
    try {
      return JSON.parse(fs.readFileSync(path.join(baseDir, fileName), 'utf8'));
    } catch (e) {
      throw new Error('Failed to parse schema: ' + fileName);
    }
  }).forEach(function(schema) {
    validator.addSchema(schema, schema.title)
  });

  return validator;
  })();
