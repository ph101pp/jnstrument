///////////////////////////////////////////////////////////////////////////////
var createGuid = function (){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
	});
}
///////////////////////////////////////////////////////////////////////////////
module.exports = function(server){

	var io = require('socket.io').listen(server);
	var sockets = {}

///////////////////////////////////////////////////////////////////////////////
	io.sockets.on('connection', function (socket) {
		var guid, type, source;
///////////////////////////////////////////////////////////////
		var addSocket = function(_guid, _type){
			guid = _guid;	
			type = _type;
			if(!sockets[guid]) sockets[guid]={};
			if(!sockets[guid][type]) sockets[guid][type] = {};
			
			//For Installation
			for(var i=0; i<sockets[guid][type].length; i++)
				socket.disconnect();

			sockets[guid][type][socket.id]=socket;		
			return true;
		}
///////////////////////////////////////////////////////////////
		var removeSocket = function(){
			if(!sockets[guid]) return false;
			if(!sockets[guid][type]) return false;
			delete  sockets[guid][type][socket.id]
			return true;
		}		
///////////////////////////////////////////////////////////////
		socket.on('__pca__Connect_Sender', function (data, answer) {
			console.log("ANSWER", "__pca__Connect_Sender", guid, socket.id);
			source = data.source;
			addSocket(data.guid && data.guid != "" ? data.guid : createGuid(), "sender");
			answer({
				status : 200,
				guid : guid,
				url : "http://localhost:8000/"
			});
		});
///////////////////////////////////////////////////////////////
		socket.on('__pca__Connect_Receiver', function (data, answer) {	
			console.log("ANSWER", "__pca__Connect_Receiver", guid, socket.id);
			addSocket(data.guid, "receiver");
			answer({
				status: 200,
				message: "Expecting Data..."
			});
		});
///////////////////////////////////////////////////////////////
		socket.on('disconnect', function () {	
			console.log("DISCONNECT", guid, socket.id);
			removeSocket();
		});
///////////////////////////////////////////////////////////////
		socket.on('__pca__Event', function (data, answer) {	
			var emit = {
				id: data.id,
				data : data,
				sender : {
					id:socket.id,
					source:source
				}
			}
			var sent=false;
			if(sockets[guid] && sockets[guid].receiver)
				for(var id in sockets[guid].receiver) {
					sockets[guid].receiver[id].emit("__pca__Event", emit);
					sent=true;
				}
			if(!sent) answer({
				status : 404,
				message : "No receiver listening" 
			})
		});
///////////////////////////////////////////////////////////////
		socket.on('__pca__ActiveElement', function (data, answer) {	
			if(sockets[guid] && sockets[guid].receiver)
				for(var id in sockets[guid].receiver) 
					if(sockets[guid].receiver[id] !== socket) 
					{
					sockets[guid].receiver[id].emit("__pca__ActiveElement", data);
				}
			// if(!sent) answer({
			// 	status : 404,
			// 	message : "No receiver listening" 
			// })
		});
///////////////////////////////////////////////////////////////
	});
///////////////////////////////////////////////////////////////////////////////
}


