module.exports = function(server){

	var io = require('socket.io').listen(server);

	var sockets = {}


	var guid = function (){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    	return v.toString(16);
		});
	}


	io.sockets.on('connection', function (socket) {
		socket.on('__pca__Connect_Sender', function (data, answer) {
			var guid = data.guid || createGuid();
			if(!sockets[guid]) sockets[guid]={};
			if(!sockets[guid].senders) sockets[guid].senders = [];

			sockets[guid].senders.push(socket);

			console.log("http://localhost:8000/"+guid, sockets);

			answer("http://localhost:8000/"+guid);
		});
	});





}
var createGuid = function (){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    	return v.toString(16);
		});
	}

