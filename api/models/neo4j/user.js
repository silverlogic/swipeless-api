// extracts just the data from the query results

var _ = require('lodash');
var md5 = require('md5');

var User = module.exports = function (_node) {
console.log("in user model");
  var email = _node.properties['email'].toString();
  var facebook = _node.properties['facebook'].toString();
  var firstName = _node.properties['firstName'].toString();
  var lastName = _node.properties['lastName'].toString();
  var avatar = _node.properties['avatar'].toString();
  var gender = _node.properties['gender'].toString();
};