"use strict";

const should = require('should');
const agent = require('test/lib/agent');

// Modules
const Auth = require('modules/auth');
const Response = require('modules/response');

describe('Integration', () => {
  describe('Response', () => {
    describe('Bulk Complete', () => {

      let auth;

      /*      let userData = {
       email: `int_response_bulk_complete@test.com`,
       password: "xxx123",
       firstName: "Andrew",
       lastName: "Test",
       type: "CLIENT",
       age: 22
       };*/

      let userData = {
        email: `mani@gmail.com`,
        password: "abc123",
        firstName: "mani",
        lastName: "mani",
        type: "CLIENT",
        age: 22
      };

      before(done => {
        Auth.register(userData, (err, _auth) => {
          if (err) return done(err);
          auth = _auth;
          done();
        });
      });

      let response;
      let response1;
      before(done => {
        Response.create({
          userId: auth.user.id,
          surveyId: parseInt(Math.random() * 100).toString(),
          questionId: parseInt(Math.random() * 100).toString(),
          date: new Date()
        }, (err, _response) => {
          if (err) return done(err);
          response = _response;
          done();
        });
      });

      before(done => {
        Response.create({
          userId: auth.user.id,
          surveyId: parseInt(Math.random() * 100).toString(),
          questionId: parseInt(Math.random() * 100).toString(),
          date: new Date()
        }, (err, _response1) => {
          if (err) return done(err);
          response1 = _response1;
          done();
        });
      });

      it('should complete a response with multiple values', done => {

        let completeData = {
          responses: [{
            id: response.id,
            values: [{value: parseInt(Math.random() * 100)}, {value: parseInt(Math.random() * 100)}]
          }]
        };

        agent
            .client()
            .put('/user/' + auth.user.id + '/response')
            .query({
              auth: auth.token
            })
            .send(completeData)
            .expect(200)
            .end(function(err, result) {
              console.log('err from put response::', err);

              should.not.exist(err);
              let responses = result.body;
              should.exist(responses);
              responses[0].state.should.equal('COMPLETE');
              done();
            });
      });
      
      //Test Data
      
    //   it('should complete a response for multiple values', done => {
          
    //     let completeData = {
    //       responses: [{
    //         id: response.id,
    //         values: [{value:2}, {value:3}]
    //       }]
    //     };

    //   });
      
    //   it('should not complete a response for multiple values', done => {
          
    //     let completeData = {
    //       responses: [{
    //         id: response.id,
    //         values: [{value:2}, {value:3}]
    //       }]
    //     };

    //   });
      
    //   it('should not complete a response for empty array of responses', done => {
          
    //     let completeData = {
    //       responses: [{
    //         id: response.id,
    //         values: []
    //       }]
    //     };

    //   });

            it('should complete a response with single value', done => {

       let completeData = {
       responses: [{
       id: response1.id,
       value: [{value: parseInt(Math.random() * 100)}]
       }]
       };

       agent
       .client()
       .put('/user/' + auth.user.id + '/response')
       .query({
       auth: auth.token
       })
       .send(completeData)
       .expect(200)
       .end(function(err, result) {
       should.not.exist(err);
       let responses = result.body;
       should.exist(responses);
       responses[0].state.should.equal('COMPLETE');
       done();
       });
       });

           it('should not complete a response', done => {

       let completeData = {
       responses: [{
       id: response.id,
       value: parseInt(Math.random() * 100)
       }]
       };

       agent
       .client()
       .put('/user/' + auth.user.id + '/response')
       .query({
       auth: '1234'
       })
       .send(completeData)
       .expect(401)
       .end(done);
       });

    });
  });
});
