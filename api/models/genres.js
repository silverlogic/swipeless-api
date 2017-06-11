var _ = require('lodash');
var Genre = require('../models/neo4j/genre');

var getAll = function(session) {
  return session.run('MATCH (genre:Baseline) RETURN genre')
    .then(_manyGenres);
};

// user rates an image with anger, disgust, fear, joy, sadness, surprise 
var rate = function (session, imageId, email, anger, disgust, fear, joy, sadness, surprise) {
  // todo: apply the rating

  // todo: calculate similarity between this user and all other users

  session.run(
    ['MATCH (user:User {email:{email}}),(image:Image {id:{imageId}})',
    'MERGE (user)-[r:RATED]->(image)',
   'SET r += {anger:{anger}, disgust:{disgust}, fear:{fear}, joy:{joy}, sadness:{sadness}, surprise:{surprise}}',
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

  return session.run(
  ['MATCH (u1:User)-[r1:RATED]->(p:Image)<-[r2:RATED]-(u2:User)',
    'WITH', 
    '// users',
    'u1,u2,',
    '// anger',
    'SUM(r1.anger*r2.anger) as anger_dot_product,',
    'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.anger) | x + a^2) ) AS anger_r1_length,',
    'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.anger) | y + b^2) ) AS anger_r2_length,',
    '// disgust',
    'SUM(r1.disgust*r2.disgust) as disgust_dot_product,',
    'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.disgust) | x + a^2) ) AS disgust_r1_length,',
    'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.disgust) | y + b^2) ) AS disgust_r2_length,',
    '// fear',
    'SUM(r1.fear*r2.fear) as fear_dot_product,',
    'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.fear) | x + a^2) ) AS fear_r1_length,',
    'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.fear) | y + b^2) ) AS fear_r2_length,',
    '// joy',
    'SUM(r1.joy*r2.joy) as joy_dot_product,',
    'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.joy) | x + a^2) ) AS joy_r1_length,',
    'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.joy) | y + b^2) ) AS joy_r2_length,',
    '// sadness',
    'SUM(r1.sadness*r2.sadness) as sadness_dot_product,',
    'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.sadness) | x + a^2) ) AS sadness_r1_length,',
    'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.sadness) | y + b^2) ) AS sadness_r2_length,',
    '// surprise',
    'SUM(r1.surprise*r2.surprise) as surprise_dot_product,',
    'SQRT( REDUCE(x=0.0, a IN COLLECT(r2.surprise) | x + a^2) ) AS surprise_r1_length,',
    'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.surprise) | y + b^2) ) AS surprise_r2_length',
    'MERGE (u1)-[s:SIMILARITY]-(u2)',
    'SET s.anger = anger_dot_product / (anger_r1_length * anger_r2_length)',
    'SET s.disgust = disgust_dot_product / (disgust_r1_length * disgust_r2_length)',
    'SET s.fear = fear_dot_product / (fear_r1_length * fear_r2_length)',
    'SET s.joy = joy_dot_product / (joy_r1_length * joy_r2_length)',
    'SET s.sadness = sadness_dot_product / (sadness_r1_length * sadness_r2_length)',
    'SET s.surprise = surprise_dot_product / (surprise_r1_length * surprise_r2_length)'].join('\n'),{}
    );
};

// function similarity () {
//   return session.run(
//   ['MATCH (u1:User)-[r1:RATED]->(p:Image)<-[r2:RATED]-(u2:User)',
//     'WITH', 
//     '// users',
//     'u1,u2',
//     '// anger',
//     'SUM(r1.anger*r2.anger) as anger_dot_product,',
//     'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.anger) | x + a^2) ) AS anger_r1_length,',
//     'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.anger) | y + b^2) ) AS anger_r2_length,',
//     '// disgust',
//     'SUM(r1.disgust*r2.disgust) as disgust_dot_product,'
//     'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.disgust) | x + a^2) ) AS disgust_r1_length,',
//     'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.disgust) | y + b^2) ) AS disgust_r2_length,',
//     '// fear',
//     'SUM(r1.fear*r2.fear) as fear_dot_product,',
//     'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.fear) | x + a^2) ) AS fear_r1_length,',
//     'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.fear) | y + b^2) ) AS fear_r2_length,',
//     '// joy',
//     'SUM(r1.joy*r2.joy) as joy_dot_product,',
//     'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.joy) | x + a^2) ) AS joy_r1_length,',
//     'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.joy) | y + b^2) ) AS joy_r2_length,',
//     '// sadness',
//     'SUM(r1.sadness*r2.sadness) as sadness_dot_product,',
//     'SQRT( REDUCE(x=0.0, a IN COLLECT(r1.sadness) | x + a^2) ) AS sadness_r1_length,',
//     'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.sadness) | y + b^2) ) AS sadness_r2_length,',
//     '// surprise',
//     'SUM(r1.surprise*r2.surprise) as surprise_dot_product,',
//     'SQRT( REDUCE(x=0.0, a IN COLLECT(r2.surprise) | x + a^2) ) AS surprise_r1_length,',
//     'SQRT( REDUCE(y=0.0, b IN COLLECT(r2.surprise) | y + b^2) ) AS surprise_r2_length',
//     'MERGE (u1)-[s:SIMILARITY]-(u2)',
//     'SET s.anger = anger_dot_product / (anger_r1_length * anger_r2_length)',
//     'SET s.disgust = disgust_dot_product / (disgust_r1_length * disgust_r2_length)',
//     'SET s.fear = fear_dot_product / (fear_r1_length * fear_r2_length)',
//     'SET s.joy = joy_dot_product / (joy_r1_length * joy_r2_length)',
//     'SET s.sadness = sadness_dot_product / (sadness_r1_length * sadness_r2_length)',
//     'SET s.surprise = surprise_dot_product / (surprise_r1_length * surprise_r2_length)'].join('\n'),{}
//     );
// }

var _manyGenres = function (result) {
  return result.records.map(r => new Genre(r.get('genre')));
};

module.exports = {
  getAll: getAll,
  rate: rate
};