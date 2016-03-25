"use strict";

const CommonValidator = require('api/common/validator');

class ResponseValidator extends CommonValidator {

  validateUpdate(req, res, next) {

    req.checkBody('values').notEmpty().isArray();

    this.validate(req, res, next);
  }
}

module.exports = new ResponseValidator();
