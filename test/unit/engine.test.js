var proxyquire = require('proxyquire');
var should = require('should');
var mocha = require('mocha');

describe('engine', function(){
  describe('#findAuth()', function(){
    it('should find an auth record with user', function(done){
      var scope = {
        Auth: {
          findOne: function(){
            return {
              populate: function(){
                return this;
              },
              exec: function(cb){
                cb(null);
              }
            }
          }
        }
      }
      var engine = require('../../lib/engine').apply(scope);
      engine.findAuth({}, function(){
        done();
      });
    });
  });
  describe('#findOrCreateAuth()', function(){
    it('should create a user if auth does not have one', function(done){
      var scope = {
        Auth:{
          findOrCreate: function(){
            return {
              populate: function(){
                return this;
              },
              exec: function(cb){
                cb(null, {});
              }
            }
          }
        },
        User:{
          create: function(){
            return {
              exec: function(cb){
                cb(null, {});
              }
            }
          }
        }
      };
      var engine = require('../../lib/engine').apply(scope);
      engine.findOrCreateAuth({},{}, function(err, user){
        user.should.be.type('object');
        done();
      });
    });
    it('should return an existing user auth object', function(done){
      var scope = {
        Auth:{
          findOrCreate: function(){
            return {
              populate: function(){
                return this;
              },
              exec: function(cb){
                cb(null, {user: {}});
              }
            }
          }
        }
      };
      var engine = require('../../lib/engine').apply(scope);
      engine.findOrCreateAuth({},{}, function(err, user){
        user.should.be.type('object');
        done();
      });
    });
  });
  describe('#attachAuthToUser()', function(){
    it('should create auth if user does not have one', function(done){
      var scope = {
        User:{
          findOne: function(){
            return {
              exec: function(cb){
                cb(null, {user: {}});
              }
            };
          }
        }
      };
      var context = {
        findOrCreateAuth: function(a,b,cb){
          cb('a');
        }
      };
      var engine = require('../../lib/engine').apply(scope);
      engine.attachAuthToUser.apply(context, [{},{id:1},function(a){
        a.should.be.type('string');
        done();
      }]);
    });

    it('should run an update if user has an auth', function(done){
      var scope = {
        User:{
          findOne: function(){
            return {
              exec: function(cb){
                cb(null, {auth: true});
              }
            };
          }
        },
        Auth:{
          update:function(){
            return {
              exec: function(cb){
                cb(null, {});
              }
            }
          }
        }
      };

      var engine = require('../../lib/engine').apply(scope);
      engine.attachAuthToUser({},{id:1},function(a, r){
        r.should.be.type('object');
        done();
      });
    });
  });
});