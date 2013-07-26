(function($, window, document, undefined) {	
	var Socket = function(){
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(entryPoint){
			var connection = require("socket.io-client").connect(entryPoint);
			var urlObj = require("url").parse(window.location);

			var receiveData = function(data, answer){
				this.emitEvent(data, answer, "jsEvent");
			}.bind(this);			

			var receiveActive = function(data, answer){
				this.emitEvent(data, answer, "activeElement");
			}.bind(this);
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
///////////////////////////////////////////////////////////////////////////////
		this.sendData = function(data, answer) {
			connection.emit("__pca__ActiveElement",data, answer);
		}
///////////////////////////////////////////////////////////////////////////////
	}
	module.exports = require("./EventEmitter.js").extend(Socket);
})(jQuery, window, document)