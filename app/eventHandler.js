module.exports = function(server){

	var io = require('socket.io').listen(server);

	var sockets = {}



	io.sockets.on('connection', function (socket) {
		
		socket.on('__pca__Connect_Sender', function (data, answer) {
			var guid = data.guid && data.guid != "" ? data.guid : createGuid();
			if(!sockets[guid]) sockets[guid]={};
			if(sockets[guid].sender) sockets[guid].sender.disconnect();

			sockets[guid].sender=socket;

			console.log("ANSWER", "__pca__Connect_Sender", "http://localhost:8000/"+guid, sockets);

			socket.set('guid', guid, function(){
				answer({
					status : 200,
					guid : guid,
					url : "http://greenish.eu01.aws.af.cm/"
				});
			});
		});

		socket.on('__pca__Connect_Receiver', function (data, answer) {	
			var guid = data.guid;	

			if(!sockets[guid] || !sockets[guid].sender) answer({
				status: 404,
				message : "Receiving no data for this Id"
			})

			if(!sockets[guid].receiver) sockets[guid].receiver = [];
			
			sockets[guid].receiver.push(socket);

			console.log("ANSWER", "__pca__Connect_Receiver", sockets);

			answer({
				status: 200
			});
		});

		socket.on('__pca__Event', function (data, answer) {	
			console.log("Event", data);
			var guid = data.guid;

			if(sockets[guid] && sockets[guid].receiver)
				for(var i=0; i< sockets[guid].receiver.length; i++)
					sockets[guid].receiver[i].emit("__pca__Event", data);

		});



	});

}
var createGuid = function (){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
	});
}

