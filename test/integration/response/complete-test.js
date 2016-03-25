"use strict";

const should = require('should');
const agent = require('test/lib/agent');

// Modules
const Auth = require('modules/auth');
const Response = require('modules/response');

describe('Integration', () => {
  describe('Response', () => {
    describe('Complete', () => {

      let auth;

      let userData = {
        email: `int_response_complete@test.com`,
        password: "xxx123",
        firstName: "Andrew",
        lastName: "Test",
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

      before(done => {
        Response.create({
          userId: auth.user.id,
          surveyId: '1234',
          questionId: '1234',
          date: new Date()
        }, (err, _response) => {
          if (err) return done(err);
          response = _response;
          done();
        });
      });

      let completeData = {
        values: [{value: parseInt(Math.random() * 100)}]
      };

      it('should complete a response for a single value', done => {
        agent
          .client()
          .put('/response/' + response.id)
          .query({
            auth: auth.token
          })
          .send(completeData)
          .expect(200)
          .end(function(err, result) {
            should.not.exist(err);
            let response = result.body;
            should.exist(response);
            response.values[0].value.should.equal(completeData.values[0].value);
            response.state.should.equal('COMPLETE');
            done();
          });
      });

      it('should not complete a response for a single value', done => {
        agent
          .client()
          .put('/response/' + response.id)
          .query({
            auth: '1234'
          })
          .send(completeData)
          .expect(401)
          .end(done);
      });
      
    //    let completeData1 = {
    //     values: [{value:2}, {value:3}]
    //   };
      
    //  it('should complete a response for multiple values', done => {
      
    //   });
      
    //   it('should not complete a response for multiple values', done => {
      
    //   });
      
    //    it('should not complete a response for empty array', done => {
      
    //   });

    //    let completeData1 = {
    //     values: [{value:2}, {value:3}]
    //   };
      
    //  it('should complete a response for multiple values', done => {
      
    //   });
      
    //   it('should not complete a response for multiple values', done => {
      
    //   });
      
    //    it('should not complete a response for empty array', done => {
      
    //   });

    });
  });
});
