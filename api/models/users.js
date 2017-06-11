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
        return session.run('MERGE (user:User {email: {email}}) MERGE (user)-[:HAS_IMAGE]->(:Image {url: {avatar}, id:{imageId} }) SET user += {id: {id}, facebook: {facebook}, email: {email}, firstName: {firstName}, lastName: {lastName}, avatar: {avatar}, gender: {gender}, api_key: {api_key}, imageId: {imageId}} RETURN user',
          {
            id: uuid.v4(),
            imageId: uuid.v4(),
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

var seek = function (session, email, seeking) {
  var query = 'MATCH (user:User {email: {email}}) SET user.seeking = {seeking} RETURN user';

  return session.run(query, {
    email: email,
    seeking: seeking
  })
};

var browse = function (session, email) {
  var query = ['match (u:User {email:{email}}),(m:User)-[:HAS_IMAGE]-(i:Image)',
  'where u.seeking = m.gender and NOT (u)-[:RATED]-(i) and u <> m',
  'and u <> m',
  'with u, m,i',
  'optional match (m)-[r:RATED]->(u)',
  'optional match (u)-[s:SIMILARITY]-(m)',
  'return distinct m.email, i.id as imageId, s.rating as similarity, r.joy as otherPersonsJoyRating',
  'order by s.rating limit 5'
  ].join('\n');

  return session.run(query, {
    email: email
  })
}

module.exports = {
  register: register,
  seek: seek,
  browse: browse
};