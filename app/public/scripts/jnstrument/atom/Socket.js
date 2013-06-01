(function($, window, document, undefined) {	
	var Socket = function(){
///////////////////////////////////////////////////////////////////////////////
		this.construct = function(entryPoint){
			var connection = require("socket.io-client").connect(entryPoint);
			var urlObj = require("url").parse(window.location);
///////////////////////////////////////////////////////////////////////////////
			connection.emit("__pca__Connect_Receiver",{guid:urlObj.pathname.match(/.*\/(.*)/)[1]}, function(data){
				console.log("Connected", data);
				if(data.status != 200) connection.disconnect();
			});
///////////////////////////////////////////////////////////////////////////////
			connection.on("__pca__Event", function(data, answer){
				this.emitEvent(data, answer);
			});
			this.activate();
		}
///////////////////////////////////////////////////////////////////////////////
	}
	module.exports = require("./EventEmitter.js").extend(Socket);
})(jQuery, window, document)