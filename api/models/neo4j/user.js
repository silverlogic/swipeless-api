// extracts just the data from the query results

var _ = require('lodash');
var md5 = require('md5');

var User = module.exports = function (_node) {
console.log("in user model");
  var email = _node.properties['email'];
  var facebook = _node.properties['facebook'];
  var firstName = _node.properties['firstName'];
  var lastName = _node.properties['lastName'];
  var avatar = _node.properties['avatar'];
  var gender = _node.properties['gender'];
  var email = _node.properties['email'];
};