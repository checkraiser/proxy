var Faye   = require('faye'),
    bayeux = new Faye.NodeAdapter({mount: '/faye'});
var redis = require("redis"),
util = require('util'),
http = require('http'),
client = redis.createClient(8085),
client2 = redis.createClient(8086),
//client3 = redis.createClient(6381),
staticServer = require('node-static'),
fs = require('fs');
var serveronline = 'dk3online';
var min = 5 * 60 * 1000; // nam moi 15 phut
var thresh = 200; // maximax
var idle = 0.8 * thresh; // idle
var clientfaye = new Faye.Client('http://localhost:9001/faye');
var file = new(staticServer.Server)('./public');

	setInterval(function(){
			client.zcard('dk3online', function(error, card){						
				client.set('ip', 's3.hpu.edu.vn.html');
				client.set('val', card);
				clientfaye.publish('/dk3', {text: card});
				
			}) ;
			client2.zcard('dk1online', function(error, card){	
				client.get('val', function(err, resp){
					if (card < resp) {
						client.set('ip', 's1.hpu.edu.vn.html');
						client.set('val', card);
					}
				});
				clientfaye.publish('/dk1', {text: card});
			}) ;
			/*client3.zcard('dk2online', function(error, card){		
				client.get('val', function(err, resp){
					if (card < resp) {
						client.set('ip', 's2.hpu.edu.vn.html');
						client.set('val', card);
					} 
				});
				clientfaye.publish('/dk2', {text: card});
			}) ; */
			client.hgetall('cpus', function(err, rep){
				if (!err && rep) {
					client2.hgetall('cpus', function(err, rep2){
						if (!err && rep2) {
							//client3.hgetall('cpus', function(err, rep3){
							//	if (!err && rep3) {									
									clientfaye.publish('/cpudk1', {text: rep2});
									//clientfaye.publish('/cpudk2', {text: rep3});
									clientfaye.publish('/cpudk3', {text: rep});
									console.log('DK1: ' + JSON.stringify(rep2));
							//		console.log('DK2: ' + JSON.stringify(rep3));
									console.log('DK3: ' + JSON.stringify(rep));
									console.log('-----------------');
							//	}
							//});
						}				
					});
				}
			});
			
			
   }, 1000);
    setInterval(function(){
			client.zcard(serveronline, function(error, card){
				if (!error) {
					if (card > idle) {		
									var args1 = [serveronline, '-inf', Date.now()];
									client.zremrangebyscore(args1, function(err, countusers){
											console.log('!removed ' + countusers );										
									});		
								}
				}
			});
   }, min);
   
var index = fs.readFileSync('./public/monitor.html');
var server = http.createServer(function(request, response) {
	
	if (request.url == "/"){
		response.writeHead(200, {'Content-Type':'text/html'});
		response.end(index);
	} else {
		request.addListener('end', function () {     
			file.serve(request, response);
		});
	}
	
	
});   
bayeux.attach(server);
server.listen(9001);