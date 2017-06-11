var _ = require('lodash');
var Genre = require('../models/neo4j/genre');

var getAll = function(session) {
  return session.run('MATCH (genre:Baseline) RETURN genre')
    .then(_manyGenres);
};

// user rates an image with anger, disgust, fear, joy, sadness, surprise 
var rate = function (session, imageId, email, anger, disgust, fear, joy, sadness, surprise) {
  return session.run(
    ['MATCH (user:User {email:{email}}),(image:Image {id:{imageId}})',
    'MERGE (user)-[r:RATED {anger:{anger}, disgust:{disgust}, fear:{fear}, joy:{joy}, sadness:{sadness}, surprise:{surprise}}]->(image)',
    'RETURN user'].join('\n'),
    {
      email: email,
      imageId: imageId,
      anger: anger, 
      surprise: surprise, 
      disgust: disgust,
      fear: fear,
      joy: joy,
      sadness: sadness,
      surprise: surprise,
    }
  );
};

var _manyGenres = function (result) {
  return result.records.map(r => new Genre(r.get('genre')));
};

module.exports = {
  getAll: getAll,
  rate: rate
};