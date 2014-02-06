var http = require('http'),
    faye = require('faye'),
	redis = require('redis'),
	db = redis.createClient();
	
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.listen(8000);