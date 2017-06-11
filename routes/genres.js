var Genres = require("../models/genres")
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

exports.rate = function (req, res, next) {
  var email = _.get(req.body, 'email');
  var imageId = _.get(req.body, 'imageId');
  var anger = _.get(req.body, 'anger');
  var disgust = _.get(req.body, 'disgust');
  var fear = _.get(req.body, 'fear');
  var joy = _.get(req.body, 'joy');
  var sadness = _.get(req.body, 'sadness');
  var surprise = _.get(req.body, 'surprise');
  
  Genres.rate(dbUtils.getSession(req), imageId, email, anger, disgust, fear, joy, sadness, surprise)
      .then(response => writeResponse(res, {}))
      .catch(next);
};

exports.list = function (req, res, next) {
  Genres.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};