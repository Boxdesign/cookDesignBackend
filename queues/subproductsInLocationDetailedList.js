var kue = require('kue');
var config = require('../config/config');
var waterfall = require('async-waterfall');
var async = require('async');
var {ObjectId} = require('mongodb');

const queue = kue.createQueue({redis: config.redisUrl});

queue.on('ready', () => {  
  // If you need to 
  console.log('Queue is ready!');
});

queue.on('error', (err) => {  
  // handle connection errors here
  log.info('Provider queue - There was an error in the queue.')
  log.info(err);
});

function subproductsInLocationDetailed(data, done) {  
  queue.create('subproductsInLocationDetailed', data)
    .priority('normal')
    .attempts(1)
    .backoff({delay: 180*1000, type:'fixed'})
    .ttl(600*1000)
    .removeOnComplete(false)
    .save((err) => {
      if (err) {
        if(done) return done(err);
      }
      if (!err) {
        if(done) done();
      }
    });
}

module.exports = {  
  subproductsInLocationDetailed: (data, done) => {
    subproductsInLocationDetailed(data, done);
  }
};