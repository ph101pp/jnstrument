(function($, window, document, undefined) {	
	var eventListener = function(entryPoint){
		var connection = require("socket.io-client").connect(entryPoint);
		var url = require("url");
		var urlObj = url.parse(window.location);
		var listener= {"all":[]};
		console.log(urlObj);
///////////////////////////////////////////////////////////////////////////////
		connection.emit("__pca__Connect_Receiver",{guid:urlObj.pathname.match(/.*\/(.*)/)[1]}, function(data){
			console.log("Connected", data);
			if(data.status != 200) connection.disconnect();
		});
///////////////////////////////////////////////////////////////////////////////
		connection.on("__pca__Event", function(data, answer){
			var allListener = $.extend([],listener["all"], listener[event.data] || []);
			for(var i=0; i<allListener.length; i++)
				window.setTimeout(allListener[i].bind(null,data),0);
		});
///////////////////////////////////////////////////////////////////////////////
		this.addListener = function(event, callback){
			if(typeof(event) === "function" && callback === undefined) {
				callback=event;
				event="all";
			}
			if(!listener[event]) listener[event]=[];
			listener[event].push(callback);
		}
///////////////////////////////////////////////////////////////////////////////
	}
	module.exports = function(entryPoint){
		return new eventListener(entryPoint);
	}
})(jQuery, window, document)