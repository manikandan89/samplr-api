"use strict";

const Question = require('modules/question');
const Response = require('modules/response');

// Constants
const RESPONSE_STATE = Response.STATE;

/**
 * Create a new question
 *
 * @method create
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.create = (req, res, next) => {

  let userId = req.userId;
  let surveyId = req.body.surveyId;
  let title = req.body.title;
  let questionType = req.body.questionType;
  let responses = req.body.responses;
  let isBranchQuestion = req.body.isBranchQuestion;

  if(isBranchQuestion === null){
    isBranchQuestion = false;
  }

  Question.create({
    userId: userId,
    surveyId: surveyId,
    title: title,
    questionType: questionType,
    responses: responses,
    branches: null,
    expectedValue: '0',
    isBranchQuestion:isBranchQuestion
  }, (err, question) => {
    if (err) return next(err);
    res.status(201).json(question);
  });
};

/**
 * Update a question
 *
 * @method create
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.update = (req, res, next) => {

  let questionId = req.params.id;
  let title = req.body.title;
  let questionType = req.body.questionType;

  Question.readAndUpdate(questionId, {
    title: title,
    questionType: questionType
  }, (err, question) => {
    if (err) return next(err);
    res.status(200).json(question);
  });
};

/**
 * Link a Question and Branch
 *
 * @method create
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.linkBranch = (req, res, next) => {

  if (req.body.branchQuestionId === null || req.body.expected === null) {
    console.log(req.body.branchQuestionId);
    console.log(req.body.expected);

    res.status(400).json(req);
  }
  else {
    let questionId = req.params.id;
    console.log("req-body::", req.body);
    let branchId = req.body.branchQuestionId;
    let expectedAnswer = req.body.expected;

    let currentQuestionObj;
    let branches = [];

    console.log("link branch - questionId::", questionId);
    console.log("link branch - branchId::", branchId);

    Question.read(questionId, (err, response) => {
      if (err) return next(err);
      console.log("response in link::", response);
      currentQuestionObj = response;
      branches = currentQuestionObj.branches;
      if (branches === undefined || branches === null) {
        branches = [];
      }
      branches.push({ branchId: branchId });
      Question.readAndUpdate(questionId, {
        branches: branches,
        expectedValue: expectedAnswer
      }, (err, question) => {
        if (err) return next(err);
        res.status(201).json(question);
      });
    });

    console.log("link branch - currentQuestionObj::", currentQuestionObj);
  }



};

/**
 * List responses for this question
 *
 * @method listResponses
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.listResponses = (req, res, next) => {

  let questionId = req.params.id;
  let state = req.params.state || RESPONSE_STATE.COMPLETE;

  Response
    .listByQuestionId(questionId, state)
    .run((err, resposnes) => {
      if (err) return next(err);
      res.status(200).json(resposnes);
    });
};
