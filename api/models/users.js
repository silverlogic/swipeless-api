"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var User = require('../models/neo4j/user');
var crypto = require('crypto');

var register = function (session, facebook, firstName, lastName, avatar, gender, email) {
  return session.run('MATCH (user:User {facebook: {facebook}}) RETURN user', {facebook: facebook})
    .then(results => {
      if (3<2) {
        throw {facebook: 'facebook already in use', status: 400}
      }
      else {
        return session.run('MERGE (user:User {facebook: {facebook}}) MERGE (user)-[:HAS_IMAGE]->(:Image {url: {avatar}}) SET user += {id: {id}, facebook: {facebook}, email: {email}, firstName: {firstName}, lastName: {lastName}, avatar: {avatar}, gender: {gender}, api_key: {api_key}} RETURN user',
          {
            id: uuid.v4(),
            facebook: facebook,
            gender: gender,
            email: email,
            firstName: firstName,
            lastName: lastName, 
            avatar: avatar,
            api_key: randomstring.generate({
              length: 20,
              charset: 'hex'
            })
          }
        ).then(results => {
            return new User(results.records[0].get('user'));
          }
        )
      }
    });
};

var me = function (session, apiKey) {
  return session.run('MATCH (user:User {api_key: {api_key}}) RETURN user', {api_key: apiKey})
    .then(results => {
      if (_.isEmpty(results.records)) {
        throw {message: 'invalid authorization key', status: 401};
      }
      return new User(results.records[0].get('user'));
    });
};

var login = function (session, username, password) {
  return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: username})
    .then(results => {
        if (_.isEmpty(results.records)) {
          throw {username: 'username does not exist', status: 400}
        }
        else {
          var dbUser = _.get(results.records[0].get('user'), 'properties');
          if (dbUser.password != hashPassword(username, password)) {
            throw {password: 'wrong password', status: 400}
          }
          return {token: _.get(dbUser, 'api_key')};
        }
      }
    );
};

function hashPassword(username, password) {
  var s = username + ':' + password;
  return crypto.createHash('sha256').update(s).digest('hex');
}

module.exports = {
  register: register,
  me: me,
  login: login
};