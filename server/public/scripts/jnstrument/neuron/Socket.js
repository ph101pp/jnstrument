(function($, window, document, undefined) {	
	var Socket = function(){
		var connection;
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(entryPoint){
			connection = require("socket.io-client").connect(entryPoint);
			var urlObj = require("url").parse(window.location);


///////////////////////////////////////////////////////////////////////////////
			connection.emit("__pca__Connect_Receiver",{guid:GUID}, function(data){
				console.log("Connected", data);
				if(data.status != 200) connection.disconnect();
			});
///////////////////////////////////////////////////////////////////////////////
			connection.on("__pca__Event", receiveData);
			connection.on("__pca__ActiveElement", receiveActive);
			this.activate();

		}
		var receiveData = function(data, answer){
			console.log(data.data.length);
			for(var i=0; i<data.data.length; i++) {
				this.emitEvent({id:data.data[i].id, data:data.data[i], sender:data.sender}, answer, "jsEvent");
			}
		}.bind(this);			

		var receiveActive = function(data, answer){
			console.log("gotActive",data);
			this.emitEvent(data, answer, "activeElement");
		}.bind(this);
///////////////////////////////////////////////////////////////////////////////
		this.sendData = function(name, data, answer) {
			connection.emit(name ,data, answer);
		}
///////////////////////////////////////////////////////////////////////////////
	}
	module.exports = require("./EventEmitter.js").extend(Socket);
})(jQuery, window, document)