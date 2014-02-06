var http = require('http'),
	fs = require('fs'),
	connect = require('connect'),	
	httpProxy = require('http-proxy'),
	Cookies = require('cookies'),
	 util = require('util'),
  uuid = require('node-uuid'),
  redback = require('redback').createClient(),
httpProxy = require('http-proxy'),
ratelimit = redback.createRateLimit('requests', {bucket_interval: 5, 
	bucket_span:7*24*3600}),
redis = require("redis"),
client = redis.createClient(8085),
i18n = require('connect-i18n');  
var app = connect()   
  .use(i18n({default_locale: 'vi-vi'}))          
  .use(myProxy);
var thresh = 300;
var idle = 0.8 * thresh;
var min = 5 *60 * 1000; //thoi gian active

 client.setMaxListeners(0);

var proxy = new httpProxy.RoutingProxy();
var serveronline='dk3online';
var numReqs = 0;
function myProxy(req, res){
	numReqs += 1;
	process.send({ cmd: 'notify', src: process.pid, num: numReqs });
	
	var myip = req.headers['x-real-ip'] || req.connection.remoteAddress || req.headers.host || req.headers['x-forwarded-for'];
	
	ratelimit.add(myip);
		
	var buffer = httpProxy.buffer(req);
					
ratelimit.count(myip, 2, function(error2, c2){
		if (!error2) {
			if (c2 > 10) {
				res.end('IP: ' + myip + ' too much requests(' + c2 + ')');
			} else {
				//console.log('myip: ' + myip);
				//req.session.uuid = req.session.uuid || uuid.v1();	
				var cooki = new Cookies( req, res );
				var aspnetid = cooki.get('ASP.NET_SessionId');
				var myid = aspnetid || uuid.v1() ;
				cooki.set('ASP.NET_SessionId', myid);
				ratelimit.add(myid);
				ratelimit.count(myid, 4, function (err, count) {		
				if (count > 25) {
					res.end('Bạn vui lòng không refresh (reload) trang web liên tục. ' + '(' + count + ')');
				} else {							
						
						
					//	console.log('myid: ' + myid);
						
						client.zcard(serveronline, function(error, card){
							
							
							if (!error) {
								if (card < 200) {
											
										if (card > 180) {		
											var min = 120 * 1000;
											var ago = Date.now() - min;
											var args1 = [serveronline, '-inf', ago];
											client.zremrangebyscore(args1, function(err, countusers){
													if (!err) {
														console.log('removed ' + countusers );										
													} else throw err;
											});		
										}	
											
										var args = [ serveronline, Date.now(), myid ];
										
										client.zadd(args, function(err, response){
											if (err) {
												console.log('error zadddd');
												res.end('error: please try later');
												throw err;
											}
											else {
												proxy.proxyRequest(req, res, {
													host: '127.0.0.1',
													port: 81,
													buffer: buffer
												});
											//	res.end('He thong dang qua tai, ban vui long nhan f5 sau it phut ');
											//res.end('He thong tam dung.');
											}
										});
										
								} else {
									var args2 = [serveronline, myid];									
									client.zrank(args2, function(err, resp){
										if (err) throw err;
										if (resp != null) {
											proxy.proxyRequest(req, res, {
													host: '127.0.0.1',
													port: 81,
													buffer: buffer
												});
												//res.end('He thong dang qua tai, ban vui long nhan f5 sau it phut ');
												//res.end('He thong tam dung.');
										} else {
											client.get('ip', function(error, resp){
											if (!error) {
												if (resp){	
													client.get('val', function(er, val){
														if (!er) {
															res.end('He thong dang qua tai, ban vui long nhan f5 sau it phut ');
															//res.end('He thong tam dung den 11h30 ngay 19/07/2013 de bo sung mot so lop mon hoc.');
														}
													});														
												} 
											}
										});
										}
									});
									
											
									
								}
							
							} else {
								console.log('error get card');
								res.end('error');
								throw error;
							}
						});
					}
				});	
			}
		
		} else {
			console.log('ratelimit error');
			res.end('error2');
			throw error2;
		}
	});
}
http.createServer(app).listen(83);