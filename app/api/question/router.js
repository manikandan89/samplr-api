"use strict";

const async = require('async');
const swagger = require('swagger-node-express');
const controller = require('./controller');
const validator = require('./validator');
const auth = require('./authorization');
const surveyAuth = require('../survey/authorization');

swagger.addPost({
  spec: {
    path: "/question",
    summary: "Create a new question",
    method: "POST",
    type: "Create",
    nickname: "create",
    produces: ["application/json"]
  },
  action: (req, res, next) => {
    async.series([
      done => surveyAuth.requiresSurveyOwner(req, res, done),
      done => validator.validateCreate(req, res, done),
      done => controller.create(req, res, done)
    ], next);
  }
});

swagger.addPut({
  spec: {
    path: "/question/{id}",
    summary: "Update a question",
    method: "PUT",
    type: "Update",
    nickname: "update",
    produces: ["application/json"]
  },
  action: (req, res, next) => {
    async.series([
      done => auth.requiresQuestionOwner(req, res, done),
      done => validator.validateUpdate(req, res, done),
      done => controller.update(req, res, done)
    ], next);
  }
});

swagger.addPut({
  spec: {
    path: "/question/{id}/link",
    summary: "Update branch for a question",
    method: "PUT",
    type: "Update",
    nickname: "update-link",
    produces: ["application/json"]
  },
  action: (req, res, next) => {
    async.series([
      done => auth.requiresQuestionOwner(req, res, done),
      done => validator.validateLink(req, res, done),
      done => controller.linkBranch(req, res, done)
    ], next);
  }
});

swagger.addGet({
  spec: {
    path: "/question/{id}/response",
    summary: "List responses for a question",
    method: "GET",
    type: "List Responses",
    nickname: "listResponses",
    produces: ["application/json"]
  },
  action: (req, res, next) => {
    async.series([
      done => auth.requiresQuestionOwner(req, res, done),
      done => controller.listResponses(req, res, done)
    ], next);
  }
});

swagger.configureDeclaration('question', {
  description: 'Question',
  authorizations: ['apiKey'],
  produces: ['application/json']
});
