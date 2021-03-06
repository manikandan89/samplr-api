"use strict";

const Survey = require('modules/survey');
const Question = require('modules/question');
const Response = require('modules/response');
const User = require('modules/user');

// Constants
const RESPONSE_STATE = Response.STATE;

/**
 * Get a survey
 *
 * @method read
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.read = (req, res, next) => {

  let surveyId = req.params.id;

  Survey.read(surveyId, (err, survey) => {
    if (err) return next(err);
    res.status(200).json(survey);
  });
};

/**
 * Create a new survey
 *
 * @method create
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.create = (req, res, next) => {

  let userId = req.userId;
  let groupId = req.body.groupId;
  let name = req.body.name;
  let schedule = req.body.schedule;

  Survey.create({
    userId: userId,
    groupId: groupId,
    name: name,
    schedule: schedule
  }, (err, survey) => {
    if (err) return next(err);
    res.status(201).json(survey);
  });
};

/**
 * Update a survey
 *
 * @method create
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.update = (req, res, next) => {

  let surveyId = req.params.id;
  let name = req.body.name;

  Survey.readAndUpdate(surveyId, {
    name: name
  }, (err, survey) => {
    if (err) return next(err);
    res.status(200).json(survey);
  });
};

/**
 * List questions for a survey
 *
 * @method listQuestions
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.listQuestions = (req, res, next) => {

  let surveyId = req.params.id;

  Question.listBySurveyId(surveyId, (err, questions) => {
    if (err) return next(err);
    res.status(200).json(questions);
  });
};

/**
 * List users in a survey
 *
 * @method listUsers
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.listUsers = (req, res, next) => {

  let surveyId = req.params.id;

  User.listBySurveyId(surveyId, (err, users) => {
    if (err) return next(err);
    res.status(200).json(users);
  });
};

/**
 * List responses for this survey
 *
 * @method listResponses
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.listResponses = (req, res, next) => {

  let surveyId = req.params.id;
  let state = req.params.state || RESPONSE_STATE.COMPLETE;

  Response
    .listBySurveyId(surveyId, state)
    .getJoin({
      question: true
    })
    .run((err, resposnes) => {
      if (err) return next(err);
      res.status(200).json(resposnes);
    });
};

/**
 * Gets a CSV of responses on a survey given a survey ID
 *
 * @method listCSVResponses
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
exports.listCSVResponses = (req, res, next) =>{

  let surveyId = req.params.id;

  Response
    .listBySurveyId(surveyId)
    .getJoin({
      user: true,
      question: true
    })
    .run((err, responses) => {
      if (err) return next(err);

      let csvarray = ["Last, First, Email, Date, Answer, Question, Question ID"];

      responses.forEach(value => {
        let qtitle = value.question.title;
        let qid = value.question.id;
        let qval = value.value;
        let qdate = value.date;
        let lname = value.user.lastName;
        let fname = value.user.firstName;
        let email = value.user.email;
        csvarray.push([lname, fname, email, qdate, qval, qtitle, qid].join(','));
      });

      let csvString = csvarray.join("\n");

      res.attachment('data.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.end(csvString);
    });
};

/**
 * Adds a user to a survey
 *
 * @method addUser
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next
 */
exports.addUser = (req, res, next) => {

  let surveyId = req.params.id;
  let userId = req.body.userId;
  let start = new Date(req.body.start);
  let end = new Date(req.body.end);

  Survey.addUser(surveyId, userId, start, end, (err, survey) => {
    if (err) return next(err);
    res.status(201).json(survey);
  });
};
