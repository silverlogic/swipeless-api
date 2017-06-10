var Users = require('../models/users')
  , writeResponse = require('../helpers/response').writeResponse
  , writeError = require('../helpers/response').writeError
  , loginRequired = require('../middlewares/loginRequired')
  , dbUtils = require('../neo4j/dbUtils')
  , _ = require('lodash');

// register a user

exports.register = function (req, res, next) {
  var facebook = _.get(req.body, 'facebook');
  var email = _.get(req.body, 'email');
  var firstName = _.get(req.body, 'firstName');
  var lastName = _.get(req.body, 'lastName');
  var avatar = _.get(req.body, 'avatar');
  var gender = _.get(req.body, 'gender');

  Users.register(dbUtils.getSession(req), facebook, firstName, lastName, avatar, gender, email)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

// set the seeking property

exports.seek = function (req, res, next) {
  var email = _.get(req.body, 'email');
  var seeking = _.get(req.body, 'seeking');
  Users.seek(dbUtils.getSession(req), email, seeking)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

