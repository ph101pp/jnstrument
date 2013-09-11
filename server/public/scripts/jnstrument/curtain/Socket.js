(function($, window, document, undefined) {	
	var Socket = function(){
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(entryPoint){
			var connection = require("socket.io-client").connect(entryPoint);
			var urlObj = require("url").parse(window.location);

			var receiveData = function(data, answer){
				for(var i=0; i<data.data.length; i++) {
					this.emitEvent({id:data.data[i].id, data:data.data[i], sender:data.sender}, answer);
				}
			}.bind(this);
///////////////////////////////////////////////////////////////////////////////
			connection.emit("__pca__Connect_Receiver",{guid:urlObj.pathname.match(/.*\/(.*)/)[1]}, function(data){
				console.log("Connected", data);
				if(data.status != 200) connection.disconnect();
			});
///////////////////////////////////////////////////////////////////////////////
			connection.on("__pca__Event", receiveData);
			this.activate();
		}
///////////////////////////////////////////////////////////////////////////////
	}
	module.exports = require("./EventEmitter.js").extend(Socket);
})(jQuery, window, document)