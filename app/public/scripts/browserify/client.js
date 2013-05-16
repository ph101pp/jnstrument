(function($, d3, window, document, undefined) {	
	$(document).ready(function(){

		var eventHandler = require("../jnstrument/clientEventHandler.js")('127.0.0.1:8000');
		var d3client = require("../jnstrument/d3client.js")(eventHandler);

	});
})(jQuery, d3, window, document)
