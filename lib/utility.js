var request = require('request');
var db = require('../app/config');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/

exports.authenticate = function(name, password, callback){
  db.knex('users').where('username', '=', name)
  .then(function(res){
    if (res[0] && res[0]['username']){
      var user = res[0]['username'];
      var salt = res[0]['salt'];
      bcrypt.hash(password, salt, null, function(err, hashedPassword){
        if (err) {
          console.log("Error generating hash for password...", err);
          return;
        }
        console.log("Finished generating pw! It is: ", hashedPassword);
        db.knex('users').where({ username: name, password: hashedPassword })
          .then(function(res){
            if (res[0]){
              callback(true);
            }else{
              callback(false);
            }
          });
      });
    }
  });
};

