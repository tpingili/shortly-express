var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function(){
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback){
    console.log("attemptedPassword:" , attemptedPassword);
    console.log('users pwd', this.get('password'));
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatched) {
      console.log("bcrypt compare returned: ", isMatched);
      callback(isMatched);
    });
  },
  hashPassword: function(){
    console.log('pre-hashed password: ', this.get('password'));
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hashedPassword){
        this.set('password', hashedPassword);
      });
  }
});

module.exports = User;
