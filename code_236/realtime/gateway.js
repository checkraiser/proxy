var cluster = require('cluster');
var http = require('http');
var util = require('util');
var numCPUs = require('os').cpus().length;
var redis = require('redis'),
	client = redis.createClient();
console.log(numCPUs);

if (cluster.isMaster) {
	var numReqs = 0;
	var worker = [];
	objs = {};
  for (var i = 0; i < numCPUs; i++) {
	worker[i] = cluster.fork();
	var workerid = worker[i].process.pid;
	objs[workerid] = i;
	worker[i].on('message', function(msg){
			if (msg.num && msg.src && msg.cmd && msg.cmd == 'notify') {
					numReqs += 1;
					
					var args = ['cpus', 'core' + objs[msg.src], msg.num];
					client.hmset(args , function(err, rep){
						if (err) throw err;
						
					});
			}			
		});
	}
	
  
	  
	cluster.on('listening', function(worker) {
		console.log('worker ' + worker.process.pid + ' listenning');
	});
	cluster.on('exit', function(worker, code, signal) {
	console.log('worker ' + worker.process.pid + ' died');
  });
} else {
   require('./proxy');
}