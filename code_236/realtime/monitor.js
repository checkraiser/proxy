
var redis = require("redis"),
client = redis.createClient();
client2 = redis.createClient(6380);
var min = 5 * 60 * 1000;
var serveronline = 'dk1online';
	setInterval(function(){
			client2.get('ip', function(error, ip){						
				if (!error) {
					client2.get('val', function(err, val){
						client.set('val', val);
						client.set('ip', ip);
					});
				}
			}) ;
   }, 1000);
   setInterval(function(){
			client.zcard(serveronline, function(error, card){
				if (!error) {
					if (card > 180) {		
									var args1 = [serveronline, '-inf', Date.now()];
									client.zremrangebyscore(args1, function(err, countusers){
											console.log('!removed ' + countusers );										
									});		
								}
				}
			});
   }, min);