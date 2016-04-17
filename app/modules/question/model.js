"use strict";

const CommonModel = require('modules/common').Model;

class QuestionModel extends CommonModel {

  schema() {
    return {
      userId: this.type.string().required(),
      surveyId: this.type.string().required(),
      title: this.type.string(),
      questionType: this.type.string().required(),
      isBranchQuestion: this.type.boolean(),
      branches: [{
        branchId: this.type.string()
      }],
      expectedValue: this.type.number().integer(),
      responses: [{
        value: this.type.number().integer(),
        text: this.type.string()
      }]
    };
  }

  relationships() {
    this.belongsTo("User", "userId");
    this.belongsTo("Survey", "surveyId");
  }
}

module.exports = QuestionModel;
